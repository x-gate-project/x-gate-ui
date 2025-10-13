"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  TextField,
  Chip,
  CircularProgress,
  Box,
  alpha,
  InputAdornment,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import { useDict } from "@/contexts/DictContext";
import { useSnackbar } from "notistack";
import TokenWithChainIcon from "@/components/TokenWithChainIcon";
import {
  useAccount,
  useBalance,
  useConfig,
} from "wagmi";
import {
  switchChain,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { baseNet, CHAIN_ID_TO_ICON_MAP, CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP, CHAIN_ID_TO_TREASURY_ADDRESS_MAP, ethereum, joc } from "@/wagmi/config";
import { Chain, parseEther, parseUnits } from "viem";
import Layout from "@/components/Layout";
import Image from "next/image";
import { Token } from "@/enums/token";
import { getTokenAddress, PAIR_TOKENS, TOKEN_TO_DECIMALS_MAP, TOKEN_TO_ICON_MAP } from "@/utils/token.utils";
import localStorageService from "@/services/local-storage.service";
import { waitForMessageReceived } from "@layerzerolabs/scan-client";
import { ethers } from "ethers";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { TransactionMethod } from "@/enums/transaction-method";
import { useTransactionState } from "@/contexts/TransactionStateContext";
import { renderTokenBalance } from "@/utils/render.util";
import { JOCX_MINT_LZ_RECEIVE_GAS_LIMIT, OFTX_SEND_LZ_RECEIVE_GAS_LIMIT, TREASURY_MINT_LZ_COMPOSE_GAS_LIMIT, TREASURY_MINT_LZ_RECEIVE_GAS_LIMIT, USDA_MINT_LZ_RECEIVE_GAS_LIMIT } from "@/consts/gas";
import SelectTokenDialog from "@/components/SelectTokenDialog";
import { readErc20Allowance, readOftaTreasuryQuoteCrossChainMint, readOftaTreasuryProxyQuoteMint, readNoftxAdapterQuoteSend, readOftxQuoteSend, writeErc20Approve, writeOftaTreasuryCrossChainMint, writeOftaTreasuryMint, writeOftaTreasuryProxyMint, writeNoftxAdapterSend, writeOftaApprove, writeOftxHelperMintAndSendOftx, writeOftxMint } from "@/wagmi/generated";

export default function Mint() {
  const dict = useDict();
  const wagmiConfig = useConfig();
  const { enqueueSnackbar } = useSnackbar();
  const [mintAmount, setMintAmount] = useState("");
  const resetMintAmount = useCallback(() => setMintAmount(""), []);
  const { classes } = useStyles();
  const { chainId } = useAccount();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [pageState, setPageState] = useState(localStorageService.getPageState());

  const getToTokenByFromToken = useCallback((token: string) => {
    return PAIR_TOKENS[token]?.mintToTokens[0];
  }, []);

  const fromToken = useMemo(() => {
    const [fromToken] = pageState.mint.token.split("/");
    return fromToken as Token;
  }, [pageState]);
  const toToken = useMemo(() => {
    const [fromToken, toToken] = pageState.mint.token.split("/");
    if(!toToken) {
      return getToTokenByFromToken(fromToken);
    }
    return toToken as Token;
  }, [pageState.mint.token, getToTokenByFromToken]);

  const fromNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === (pageState.mint.fromChainId)) || ethereum, [pageState, wagmiConfig]);
  const toNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === (pageState.mint.toChainId)) || ethereum, [pageState, wagmiConfig]);
  const { data: fromTokenData, refetch: refetchFromTokenBalance } =
    useBalance({
      address,
      token: getTokenAddress(fromToken, fromNetwork) as `0x${string}`,
      chainId: fromNetwork.id,
    });
  const { data: toTokenData, refetch: refetchToTokenBalance } = useBalance({
    address,
    token: getTokenAddress(toToken, toNetwork) as `0x${string}`,
    chainId: toNetwork.id,
  });
  const { addTransaction, isMinting, setIsMinting } = useTransactionState();
  const displayDecimals = TOKEN_TO_DECIMALS_MAP[fromToken];
  const fromTokenBalance = fromTokenData ?  renderTokenBalance(fromTokenData?.formatted, { displayDecimals }) : '';
  const toTokenBalance = toTokenData ?  renderTokenBalance(toTokenData?.formatted, { displayDecimals }) : '';;
  const insufficientBalance = mintAmount
    ? Number(mintAmount) > Number(fromTokenBalance)
    : false;

  const [openFromTokenChangeDialog, setOpenFromTokenChangeDialog] = useState(false);
  const [openToTokenChangeDialog, setOpenToTokenChangeDialog] = useState(false);

  const onOpenFromTokenChangeDialog = useCallback(() => {
    setOpenFromTokenChangeDialog(true);
  }, [setOpenFromTokenChangeDialog]);
  const onCloseFromTokenChangeDialog = useCallback(() => {
    setOpenFromTokenChangeDialog(false);
  }, [setOpenFromTokenChangeDialog]);
  const onOpenToTokenChangeDialog = useCallback(() => {
    setOpenToTokenChangeDialog(true);
  }, [setOpenToTokenChangeDialog]);
  const onCloseToTokenChangeDialog = useCallback(() => {
    setOpenToTokenChangeDialog(false);
  }, [setOpenToTokenChangeDialog]);

  const handleMintAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const amount = event.target.value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${displayDecimals}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal
      setMintAmount(amount);
    },
    [displayDecimals]
  );

  const handleSetMaxAmount = useCallback(() => {
    if (fromTokenBalance) {
      setMintAmount(fromTokenBalance);
    }
  }, [fromTokenBalance]);

  const mintJOCX = useCallback(async (address: `0x${string}`) => {
    try {
      setIsMinting(true);
      if (chainId !== joc.id) {
        await switchChain(wagmiConfig, { chainId: joc.id });
      }

      const tokensToMint = parseEther(mintAmount);
      const options = Options.newOptions()
      .addExecutorLzReceiveOption(JOCX_MINT_LZ_RECEIVE_GAS_LIMIT, 0)
      .toHex()
      .toString();

      const sendParam = {
        dstEid: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[toNetwork.id],
        to: ethers.zeroPadValue(address, 32) as `0x${string}`,
        amountLD: tokensToMint,
        minAmountLD: tokensToMint,
        extraOptions: options as `0x${string}`,
        composeMsg: "0x" as `0x${string}`,
        oftCmd: "0x" as `0x${string}`,
      };

      const fee = await readNoftxAdapterQuoteSend(wagmiConfig, {
        address: process.env.NEXT_PUBLIC_JOCX_ADAPTER_JOC_ADDRESS as `0x${string}`,
        args: [sendParam, false],
      });

      const mintTokenTxHash = await writeNoftxAdapterSend(wagmiConfig, {
        address: process.env.NEXT_PUBLIC_JOCX_ADAPTER_JOC_ADDRESS as `0x${string}`,
        args: [sendParam, {nativeFee: fee.nativeFee, lzTokenFee: BigInt(0)}, address],
        value: fee.nativeFee + tokensToMint,
      });

      enqueueSnackbar( dict.mint_tab.waiting_for_sending
        .replace("{{token}}", fromToken)
        .replace("{{destination}}", toNetwork.name),
        { variant: "info" }
      );

      setIsMinting(false);
      resetMintAmount();

      await addTransaction(
        {
          hash: mintTokenTxHash,
          summary: `Mint ${mintAmount} ${toToken} from ${fromNetwork.name} to ${toNetwork.name}`,
          fromAddress: address,
          toAddress: address,
          fromChainId: fromNetwork.id,
          toChainId: toNetwork.id,
          amount: mintAmount,
          method: TransactionMethod.MINT,
          token: toToken,
          lzEndpointId: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[fromNetwork.id],
          createdAt: Date.now(),
        },
        async () => {
          await waitForTransactionReceipt(wagmiConfig, {
            hash: mintTokenTxHash,
          });
          await waitForMessageReceived(
            CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[fromNetwork.id],
            mintTokenTxHash,
          );
        },
      );

      refetchFromTokenBalance();
      refetchToTokenBalance();
      enqueueSnackbar(
        dict.mint_tab.mint_success
          .replace("{{token}}", toToken)
          .replace("{{from}}", fromNetwork.name)
          .replace("{{to}}", toNetwork.name),
        { variant: "success" }
      );
    } catch (error) {
        console.log(`Mint ${toToken} failed with error: ${error}`);
        enqueueSnackbar(
          dict.mint_tab.mint_failed
            .replace("{{token}}", toToken)
            .replace("{{from}}", fromNetwork.name)
            .replace("{{to}}", toNetwork.name)
            .replace("{{error}}", (error as any).shortMessage || dict.error_page.unknown_error),
          { variant: "error", style: { whiteSpace: "pre-line" } }
        );
    } finally {
      setIsMinting(false);
    }
  }, [
    toNetwork,
    mintAmount,
    toToken,
    wagmiConfig,
    addTransaction,
    fromNetwork,
    dict,
    enqueueSnackbar,
    setIsMinting,
    resetMintAmount,
    fromToken,
    chainId,
    refetchFromTokenBalance,
    refetchToTokenBalance,
  ]);

  const mintUSDA = useCallback(async (address: `0x${string}`) => {
    try {
      setIsMinting(true);
      if (chainId !== fromNetwork.id) {
        await switchChain(wagmiConfig, { chainId: fromNetwork.id });
      }

      const sourceTokenAddress = getTokenAddress(fromToken, fromNetwork) as `0x${string}`;
      const tokensToMint = parseUnits(mintAmount, TOKEN_TO_DECIMALS_MAP[fromToken]);

      if(fromNetwork.id !== toNetwork.id) {
        const options = Options.newOptions().addExecutorLzReceiveOption(USDA_MINT_LZ_RECEIVE_GAS_LIMIT, 0).toHex().toString()

        const allowance = await readErc20Allowance(wagmiConfig, {
          address: sourceTokenAddress,
          args: [address, process.env.NEXT_PUBLIC_TREASURY_ETHEREUM_ADDRESS as `0x${string}`],
        });

        if((allowance as bigint) !== tokensToMint) {
          if(allowance !== BigInt(0) && fromToken === Token.USDT) {
            const approveTokenToZeroTxHash = await writeErc20Approve(wagmiConfig, {
              address: sourceTokenAddress as `0x${string}`,
              args: [process.env.NEXT_PUBLIC_TREASURY_ETHEREUM_ADDRESS as `0x${string}`, BigInt(0)],
            });

            await waitForTransactionReceipt(wagmiConfig, {
              hash: approveTokenToZeroTxHash,
            });
          }

          const approveTokenTxHash = await writeErc20Approve(wagmiConfig, {
            address: sourceTokenAddress as `0x${string}`,
            args: [process.env.NEXT_PUBLIC_TREASURY_ETHEREUM_ADDRESS as `0x${string}`, tokensToMint],
          });

          await waitForTransactionReceipt(wagmiConfig, {
            hash: approveTokenTxHash,
          });
        }

        const crossChainMintParam = {
          dstEid: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[toNetwork.id],
          amount: tokensToMint,
          minAmount: tokensToMint,
          token: sourceTokenAddress,
          extraOptions: options as `0x${string}`,
        }

        const fee: any = await readOftaTreasuryQuoteCrossChainMint(wagmiConfig, {
          address: process.env.NEXT_PUBLIC_TREASURY_ETHEREUM_ADDRESS as `0x${string}`,
          args: [crossChainMintParam],
        });

        const mintTokenTxHash = await writeOftaTreasuryCrossChainMint(wagmiConfig, {
          address: process.env.NEXT_PUBLIC_TREASURY_ETHEREUM_ADDRESS as `0x${string}`,
          args: [crossChainMintParam, fee],
          value: fee.nativeFee,
        });

        enqueueSnackbar( dict.mint_tab.waiting_for_sending
          .replace("{{token}}", fromToken)
          .replace("{{destination}}", toNetwork.name),
          { variant: "info" }
        );

        setIsMinting(false);
        resetMintAmount();

        await addTransaction({
          hash: mintTokenTxHash,
          summary: `Mint ${mintAmount} ${toToken} from ${fromNetwork.name} to ${toNetwork.name}`,
          fromAddress: address,
          toAddress: address,
          fromChainId: fromNetwork.id,
          toChainId: toNetwork.id,
          amount: mintAmount,
          method: TransactionMethod.MINT,
          token: toToken,
          lzEndpointId: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[fromNetwork.id],
          createdAt: Date.now(),
        }, async () => {
          await waitForTransactionReceipt(wagmiConfig, {
            hash: mintTokenTxHash,
          });
          await waitForMessageReceived(CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[fromNetwork.id], mintTokenTxHash);
        });

      } else {
        if ((fromToken === Token.USDTX || fromToken === Token.USDCX)) {
          const options = Options.newOptions()
            .addExecutorLzReceiveOption(TREASURY_MINT_LZ_RECEIVE_GAS_LIMIT, 0)
            .addExecutorComposeOption(0, TREASURY_MINT_LZ_COMPOSE_GAS_LIMIT, 0)
            .toHex()
            .toString()

          const mintParam = {
            dstEid: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[ethereum.id],
            amount: tokensToMint,
            minAmount: tokensToMint,
            token: sourceTokenAddress,
            extraOptions: options as `0x${string}`,
          }

          const fee: any = await readOftaTreasuryProxyQuoteMint(wagmiConfig, {
            address: CHAIN_ID_TO_TREASURY_ADDRESS_MAP[fromNetwork.id] as `0x${string}`,
            args: [mintParam],
          });

          const approveTokenTxHash = await writeOftaApprove(wagmiConfig, {
            address: sourceTokenAddress,
            args: [CHAIN_ID_TO_TREASURY_ADDRESS_MAP[fromNetwork.id] as `0x${string}`, tokensToMint],
          });

          await waitForTransactionReceipt(wagmiConfig, {
            hash: approveTokenTxHash,
          });

          const mintTokenTxHash = await writeOftaTreasuryProxyMint(wagmiConfig, {
            address: CHAIN_ID_TO_TREASURY_ADDRESS_MAP[fromNetwork.id] as `0x${string}`,
            args: [mintParam, fee],
            value: fee.nativeFee,
          });

          enqueueSnackbar( dict.mint_tab.waiting_for_sending
            .replace("{{token}}", fromToken)
            .replace("{{destination}}", toNetwork.name),
            { variant: "info" }
          );

          setIsMinting(false);
          resetMintAmount();

          await addTransaction({
            hash: mintTokenTxHash,
            summary: `Mint ${mintAmount} ${toToken} from ${fromNetwork.name} to ${toNetwork.name}`,
            fromAddress: address,
            toAddress: address,
            fromChainId: fromNetwork.id,
            toChainId: toNetwork.id,
            amount: mintAmount,
            method: TransactionMethod.MINT,
            token: toToken,
            lzEndpointId: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[fromNetwork.id],
            createdAt: Date.now(),
          }, async () => {
            await waitForTransactionReceipt(wagmiConfig, {
              hash: mintTokenTxHash,
            });
            await waitForMessageReceived(CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[fromNetwork.id], mintTokenTxHash);
          });

          refetchFromTokenBalance();
          refetchToTokenBalance();
          enqueueSnackbar(
            dict.mint_tab.mint_success
              .replace("{{token}}", toToken)
              .replace("{{from}}", fromNetwork.name)
              .replace("{{to}}", toNetwork.name),
            { variant: "success" }
          );

          return;
        }

        const allowance = await readErc20Allowance(wagmiConfig, {
          address: sourceTokenAddress,
          args: [address, CHAIN_ID_TO_TREASURY_ADDRESS_MAP[fromNetwork.id] as `0x${string}`],
        });

        if((allowance as bigint) !== tokensToMint) {
          if(allowance !== BigInt(0) && fromToken === Token.USDT) {
            const approveTokenToZeroTxHash = await writeErc20Approve(wagmiConfig, {
              address: sourceTokenAddress as `0x${string}`,
              args: [
                CHAIN_ID_TO_TREASURY_ADDRESS_MAP[fromNetwork.id] as any,
                BigInt(0),
              ],
            });

            await waitForTransactionReceipt(wagmiConfig, {
              hash: approveTokenToZeroTxHash,
            });
          }

          const approveTokenTxHash = await writeErc20Approve(wagmiConfig, {
            address: sourceTokenAddress as `0x${string}`,
            args: [CHAIN_ID_TO_TREASURY_ADDRESS_MAP[fromNetwork.id] as `0x${string}`, tokensToMint],
          });
          await waitForTransactionReceipt(wagmiConfig, {
            hash: approveTokenTxHash,
          });
        }

        const mintTokenTxHash = await writeOftaTreasuryMint(wagmiConfig, {
          address: CHAIN_ID_TO_TREASURY_ADDRESS_MAP[fromNetwork.id] as `0x${string}`,
          args: [sourceTokenAddress, tokensToMint],
        });

        enqueueSnackbar( dict.mint_tab.waiting_for_sending
          .replace("{{token}}", fromToken)
          .replace("{{destination}}", toNetwork.name),
          { variant: "info" }
        );

        setIsMinting(false);
        resetMintAmount();

        await addTransaction({
          hash: mintTokenTxHash,
          summary: `Mint ${mintAmount} ${toToken} from ${fromNetwork.name} to ${toNetwork.name}`,
          fromAddress: address,
          toAddress: address,
          fromChainId: fromNetwork.id,
          toChainId: toNetwork.id,
          amount: mintAmount,
          method: TransactionMethod.MINT,
          token: toToken,
          createdAt: Date.now(),
        }, async () => {
          await waitForTransactionReceipt(wagmiConfig, {
            hash: mintTokenTxHash,
          });
        });
      }

      refetchFromTokenBalance();
      refetchToTokenBalance();
      enqueueSnackbar(
        dict.mint_tab.mint_success
          .replace("{{token}}", toToken)
          .replace("{{from}}", fromNetwork.name)
          .replace("{{to}}", toNetwork.name),
        { variant: "success" }
      );
    } catch (error) {
        console.log(`Mint ${toToken} failed with error: ${error}`);
        enqueueSnackbar(
          dict.mint_tab.mint_failed
            .replace("{{token}}", toToken)
            .replace("{{from}}", fromNetwork.name)
            .replace("{{to}}", toNetwork.name)
            .replace("{{error}}", (error as any).shortMessage || dict.error_page.unknown_error),
          { variant: "error", style: { whiteSpace: "pre-line" } }
        );
    } finally {
      setIsMinting(false);
    }
  }, [
    toNetwork,
    mintAmount,
    toToken,
    wagmiConfig,
    addTransaction,
    fromNetwork,
    dict,
    enqueueSnackbar,
    setIsMinting,
    resetMintAmount,
    fromToken,
    chainId,
    refetchFromTokenBalance,
    refetchToTokenBalance,
  ]);

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      if (!address) {
        return;
      }

      if (fromToken === Token.JOC && toToken === Token.JOCX) {
        await mintJOCX(address);
        return;
      }

      if (toToken === Token.USDA) {
        await mintUSDA(address);
        return;
      }

      try {
        setIsMinting(true);

        if (chainId !== ethereum.id) {
          await switchChain(wagmiConfig, { chainId: ethereum.id });
        }

        const sourceTokenAddress = fromToken === Token.USDT ? process.env.NEXT_PUBLIC_USDT_ETHEREUM_ADDRESS! : process.env.NEXT_PUBLIC_USDC_ETHEREUM_ADDRESS!
        const destinationTokenAddress = fromToken === Token.USDT ? process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS! : process.env.NEXT_PUBLIC_USDCX_ETHEREUM_ADDRESS!

        if (toNetwork.id !== ethereum.id) {
          const options = Options.newOptions().addExecutorLzReceiveOption(OFTX_SEND_LZ_RECEIVE_GAS_LIMIT, 0).toHex().toString()

          const sendParam = {
            dstEid: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[toNetwork.id],
            to: ethers.zeroPadValue(address, 32) as `0x${string}`,
            amountLD: parseUnits(mintAmount, 6),
            minAmountLD: parseUnits(mintAmount, 6),
            extraOptions: options as `0x${string}`,
            composeMsg: '0x' as `0x${string}`,
            oftCmd: '0x' as `0x${string}`,
          };

          const fee: any = await readOftxQuoteSend(wagmiConfig, {
            address: destinationTokenAddress as `0x${string}`,
            args: [sendParam, false],
          });

          const allowance = await readErc20Allowance(wagmiConfig, {
            address: sourceTokenAddress as `0x${string}`,
            args: [address, process.env.NEXT_PUBLIC_OFTX_HELPER_ADDRESS as `0x${string}`],
          });

          if((allowance as bigint) !== parseUnits(mintAmount, 6)) {
            if(allowance !== BigInt(0) && fromToken === Token.USDT) {
              const approveTokenToZeroTxHash = await writeErc20Approve(wagmiConfig, {
                address: sourceTokenAddress as `0x${string}`,
                args: [process.env.NEXT_PUBLIC_OFTX_HELPER_ADDRESS as `0x${string}`, BigInt(0)],
              });

              await waitForTransactionReceipt(wagmiConfig, {
                hash: approveTokenToZeroTxHash,
              });
            }

            const approveTokenTxHash = await writeErc20Approve(wagmiConfig, {
              address: sourceTokenAddress as `0x${string}`,
              args: [process.env.NEXT_PUBLIC_OFTX_HELPER_ADDRESS as `0x${string}`, parseUnits(mintAmount, 6)],
            });
            await waitForTransactionReceipt(wagmiConfig, {
              hash: approveTokenTxHash,
            });
          }

          const mintTokenTxHash = await writeOftxHelperMintAndSendOftx(wagmiConfig, {
            address: process.env.NEXT_PUBLIC_OFTX_HELPER_ADDRESS as `0x${string}`,
            args: [destinationTokenAddress as `0x${string}`, sendParam, {nativeFee: fee.nativeFee, lzTokenFee: BigInt(0)} , address],
            value: fee.nativeFee,
          });

          enqueueSnackbar( dict.mint_tab.waiting_for_sending
            .replace("{{token}}", fromToken)
            .replace("{{destination}}", toNetwork.name),
            { variant: "info" }
          );

          setIsMinting(false);
          resetMintAmount();

          await addTransaction({
            hash: mintTokenTxHash,
            summary: `Mint ${mintAmount} ${toToken} from ${fromNetwork.name} to ${toNetwork.name}`,
            fromAddress: address,
            toAddress: address,
            fromChainId: fromNetwork.id,
            toChainId: toNetwork.id,
            amount: mintAmount,
            method: TransactionMethod.MINT,
            token: toToken,
            lzEndpointId: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[fromNetwork.id],
            createdAt: Date.now(),
          }, async () => {
            await waitForTransactionReceipt(wagmiConfig, {
              hash: mintTokenTxHash,
            });
            await waitForMessageReceived(CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[fromNetwork.id], mintTokenTxHash);
          });
        } else {
          const allowance = await readErc20Allowance(wagmiConfig, {
            address: sourceTokenAddress as `0x${string}`,
            args: [address, destinationTokenAddress as `0x${string}`],
          });
          if((allowance as bigint) !== parseUnits(mintAmount, 6)) {
            if(allowance !== BigInt(0) && fromToken === Token.USDT) {
              const approveTokenToZeroTxHash = await writeErc20Approve(wagmiConfig, {
                address: sourceTokenAddress as `0x${string}`,
                args: [destinationTokenAddress as `0x${string}`, BigInt(0)],
              });
              await waitForTransactionReceipt(wagmiConfig, {
                hash: approveTokenToZeroTxHash,
              });
            }

            const approveTokenTxHash = await writeErc20Approve(wagmiConfig, {
              address: sourceTokenAddress as `0x${string}`,
              args: [destinationTokenAddress as `0x${string}`, parseUnits(mintAmount, 6)],
            });

            await waitForTransactionReceipt(wagmiConfig, {
              hash: approveTokenTxHash,
            });
          }

          console.log(`Approved ${toToken} successfully. Minting ${toToken} ...`);

          const mintTokenTxHash = await writeOftxMint(wagmiConfig, {
            address:
              fromToken === Token.USDT
                ? (process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS as `0x${string}`)
                : (process.env.NEXT_PUBLIC_USDCX_ETHEREUM_ADDRESS as `0x${string}`),
            args: [parseUnits(mintAmount, 6)],
          });

          setIsMinting(false);
          resetMintAmount();

          await addTransaction({
            hash: mintTokenTxHash,
            summary: `Mint ${mintAmount} ${toToken} from ${fromNetwork.name} to ${toNetwork.name}`,
            fromAddress: address,
            toAddress: address,
            fromChainId: fromNetwork.id,
            toChainId: toNetwork.id,
            amount: mintAmount,
            method: TransactionMethod.MINT,
            token: toToken,
            createdAt: Date.now(),
          }, async () => {
            await waitForTransactionReceipt(wagmiConfig, {
              hash: mintTokenTxHash,
            });
          });
        }
        console.log(`Mint ${toToken} successfully.`);

        refetchFromTokenBalance();
        refetchToTokenBalance();
        enqueueSnackbar(
          dict.mint_tab.mint_success
            .replace("{{token}}", toToken)
            .replace("{{from}}", fromNetwork.name)
            .replace("{{to}}", toNetwork.name),
          { variant: "success" }
        );
      } catch (error) {
        console.log(`Mint ${fromToken} failed with error: ${error}`);
        enqueueSnackbar(
          dict.mint_tab.mint_failed
            .replace("{{token}}", toToken)
            .replace("{{from}}", fromNetwork.name)
            .replace("{{to}}", toNetwork.name)
            .replace("{{error}}", (error as any).shortMessage || dict.error_page.unknown_error),
          { variant: "error", style: { whiteSpace: "pre-line" } }
        );
      } finally {
        setIsMinting(false);
      }
    },
    [
      chainId,
      enqueueSnackbar,
      mintAmount,
      refetchFromTokenBalance,
      resetMintAmount,
      wagmiConfig,
      fromToken,
      dict,
      toNetwork,
      address,
      refetchToTokenBalance,
      addTransaction,
      setIsMinting,
      toToken,
      mintJOCX,
      fromNetwork,
      mintUSDA,
    ]
  );

  const handleSelectFromToken = useCallback((token: Token, network: Chain) => {
    const isFromJOC = token === Token.JOC && toNetwork.id === joc.id;
    let mappingToToken = getToTokenByFromToken(token);
    const mintToTokens = PAIR_TOKENS[token]?.mintToTokens || [];
    if(mintToTokens.includes(toToken)) {
      mappingToToken = toToken;
    }

    const mappingToTokenConfig = PAIR_TOKENS[mappingToToken];
    const isToNetworkSupported = mappingToTokenConfig?.suportedNetworks?.some(
      (supportedNet) => supportedNet.id === toNetwork.id
    );

    let finalToChainId = isFromJOC
      ? ethereum.id
      : (isToNetworkSupported
          ? toNetwork.id
          : mappingToTokenConfig?.suportedNetworks?.[0]?.id);

    if(token === Token.USDTX || token === Token.USDCX) {
      finalToChainId = network.id;
    }

    const pageState = localStorageService.setPageState({
      mintToken: `${token}/${mappingToToken}`,
      mintFromChainId: network.id,
      mintToChainId: finalToChainId,
    });
    setPageState(pageState);
  }, [setPageState, toNetwork, getToTokenByFromToken, toToken]);

  const handleSelectToToken = useCallback((token: Token, network: Chain) => {
    const pageState = localStorageService.setPageState({
      mintToChainId: network.id,
      mintToken: `${fromToken}/${token}`,
    });
    setPageState(pageState);
  }, [setPageState, fromToken]);

  const fromTokens = useMemo(() => {
    const tokens = Object.keys(PAIR_TOKENS).filter(token => PAIR_TOKENS[token].mintToTokens.length > 0) as Token[];
    return [ethereum, joc, baseNet].flatMap((network) => {
      return tokens.map((token) => {
        if (token === Token.JOC && network.id === joc.id) {
          return {
            token,
            network: joc,
          };
        }

        const tokenConfig = PAIR_TOKENS[token];
        const isNetworkSupported = tokenConfig?.suportedNetworks?.some(
          (supportedNet) => supportedNet.id === network.id
        );

        const isUsdaEthSpecialCase =
          (token === Token.USDTX || token === Token.USDCX) &&
          network.id === ethereum.id;

        if (!isNetworkSupported || isUsdaEthSpecialCase) {
          return null;
        }

        return {
          token,
          network,
        };
      });
    });
  }, []);

  const toTokens = useMemo(() => {
    const tokens = PAIR_TOKENS[fromToken]?.mintToTokens || [toToken];

    if ((fromToken === Token.USDTX || fromToken === Token.USDCX) && (fromNetwork.id === joc.id || fromNetwork.id === baseNet.id)) {
      return [{
        token: Token.USDA,
        network: fromNetwork,
      }];
    }

    return wagmiConfig.chains.flatMap((network) => {
      return tokens.map((token) => {
        if (token === Token.JOC && network.id === joc.id) {
          return {
            token,
            network: joc,
          };
        }

        const tokenConfig = PAIR_TOKENS[token];
        const isNetworkSupported = tokenConfig?.suportedNetworks?.some(
          (supportedNet) => supportedNet.id === network.id
        );

        const isUsdaEthSpecialCase =
          (fromToken === Token.USDTX || fromToken === Token.USDCX) &&
          token === Token.USDA &&
          network.id === ethereum.id;

        if (!isNetworkSupported || isUsdaEthSpecialCase) {
          return null;
        }

        return {
          token,
          network,
        };
      });
    });
  }, [fromToken, toToken, wagmiConfig, fromNetwork]);

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className={classes.wrapper}>
          <div className={classes.infoWrapper}>
            <div className={classes.itemWrapper}>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                gap="8px"
                border="1px solid rgb(247, 248, 250)"
                borderRadius="20px"
                padding="16px"
              >
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="4px">
                  <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                    <Box className={classes.inputTitle}>
                    {dict.mint_tab.mint}
                    </Box>
                  </Box>
                  {fromTokenBalance &&
                    <div className={classes.topBalanceWrapper}>
                      <Box color="#64748B" fontSize={14}>{dict.mint_tab.balance}:</Box>
                      <Box color="#64748B"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      whiteSpace="nowrap">
                        {fromTokenBalance}
                      </Box>
                    </div>
                  }
                </Box>
                <Box width="100%" display="flex" alignItems="start" justifyContent="center" flexDirection="column">
                  <TextField
                  fullWidth
                  className={classes.newTextField}
                    placeholder="0"
                    InputProps={{
                      sx: { paddingRight: "0px" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <div className={classes.recommendWrapper}>
                            {fromToken !== Token.JOC && <div className={classes.chipWrapper}>
                              <Chip
                                onClick={handleSetMaxAmount}
                                label={dict.mint_tab.max}
                                className={classes.chipButton}
                              />
                            </div>}
                            <div className={classes.balanceWrapper}>
                              <div
                                className={classes.selectedTokenWrapper}
                                onClick={onOpenFromTokenChangeDialog}
                              >
                                <TokenWithChainIcon
                                  tokenIcon={TOKEN_TO_ICON_MAP[fromToken]}
                                  chainIcon={CHAIN_ID_TO_ICON_MAP[fromNetwork.id]}
                                  width={24}
                                  height={24}
                                />
                                <Box paddingLeft="2px" color="black">
                                  {fromToken}
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                  <Image src="/icons/caret-sort.svg" alt="USDT" width={16} height={16} />
                                </Box>
                              </div>
                            </div>
                          </div>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "0px",
                      },
                    }}
                    autoFocus
                    size="medium"
                    value={mintAmount}
                    onChange={handleMintAmountChange}
                    inputProps={{ "data-testid": "amount-input" }}
                    error={insufficientBalance}
                    helperText={insufficientBalance && dict.mint_tab.invalid_amount}
                    FormHelperTextProps={{
                      className: classes.helperText,
                    }}
                  />
                </Box>
              </Box>
            </div>

            <div className={classes.itemWrapper}>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                gap="8px"
                border="1px solid rgb(247, 248, 250)"
                borderRadius="20px"
                padding="16px"
              >
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="4px">
                  <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                    <Box className={classes.inputTitle}>
                      {dict.mint_tab.made}
                    </Box>
                  </Box>
                  {toTokenBalance &&
                    <div className={classes.topBalanceWrapper}>
                      <Box color="#64748B" fontSize={14}>{dict.mint_tab.balance}:</Box>
                      <Box color="#64748B">
                        {toTokenBalance}
                      </Box>
                    </div>
                  }
                </Box>
                <Box width="100%" display="flex" alignItems="start" justifyContent="center" flexDirection="column">
                  <TextField
                    fullWidth
                    placeholder="0"
                    disabled
                    InputProps={{
                      sx: { paddingRight: "0px" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <div className={classes.recommendWrapper}>
                            <div className={classes.balanceWrapper}>
                              <Box
                                sx={{
                                  borderRadius: "9999px",
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "8px 12px",
                                  gap: "2px",
                                  cursor: "pointer",
                                  backgroundColor: "white",
                                  border: "1px solid #E2E8F0",
                                }}
                                onClick={onOpenToTokenChangeDialog}
                              >
                                <TokenWithChainIcon
                                  tokenIcon={TOKEN_TO_ICON_MAP[toToken]}
                                  chainIcon={CHAIN_ID_TO_ICON_MAP[toNetwork.id]}
                                  width={24}
                                  height={24}
                                />
                                <Box paddingLeft="2px" color="black">
                                  {toToken}
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                  <Image src="/icons/caret-sort.svg" alt="USDT" width={16} height={16} />
                                </Box>
                              </Box>
                            </div>
                          </div>
                        </InputAdornment>
                      ),
                    }}
                    className={classes.newTextField}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "0px",
                      },
                    }}
                    size="medium"
                    value={mintAmount}
                    name="to"
                    inputProps={{ "data-testid": "to-input" }}
                  />
                </Box>
              </Box>
            </div>
          </div>
          <Button
              variant="contained"
              className={classes.mintButton}
              type="submit"
              color="primary"
              startIcon={isMinting ? <CircularProgress color="inherit" size={24} /> : undefined}
              disabled={
                isMinting ||
                !mintAmount ||
                insufficientBalance ||
                isDisconnected ||
                isConnecting
              }
            >
              {dict.mint_tab.button}
            </Button>
        </div>
      </form>
      <SelectTokenDialog
        open={openToTokenChangeDialog}
        onClose={onCloseToTokenChangeDialog}
        onChangeToken={handleSelectToToken}
        selectedToken={{ token: toToken, network: toNetwork }}
        tokens={toTokens as { token: Token; network: Chain }[]}
        isFrom={false}
      />
      <SelectTokenDialog
        open={openFromTokenChangeDialog}
        onClose={onCloseFromTokenChangeDialog}
        onChangeToken={handleSelectFromToken}
        selectedToken={{ token: fromToken, network: fromNetwork }}
        tokens={fromTokens as { token: Token; network: Chain }[]}
        isFrom={true}
      />
    </Layout>
  );
}

const useStyles = makeStyles()((theme: Theme) => ({
  wrapper: {
    width: "100%",
    padding: '16px',
    borderRadius: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    boxShadow: "rgba(0, 0, 0, 0.01)  0px 0px 1px, rgba(0, 0, 0, 0.04)  0px 4px 8px, rgba(0, 0, 0, 0.04)  0px 16px 24px, rgba(0, 0, 0, 0.01)  0px 24px 32px",
    border: `none`,
    backgroundColor: "white",
  },
  infoWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  itemWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "start",
  },
  mintButton: {
    textTransform: "none",
    padding: "14px 12px",
    borderRadius: "12px",
    width: "100%",
  },
  sendTitle: {
    fontSize: "16px",
    fontWeight: 400,
    textAlign: "left",
  },
  textFieldWrapper: {
    display: "flex",
    flex: 1,
    width: "100%",
    borderRadius: "8px",
    justifyContent: "center",
    alignItems: "center",
  },
  textField: {
    "& input": { fontSize: "32px", fontWeight: 400 },
    fontSize: "32px",
    fontStyle: "normal",
    fontWeight: 400,
  },
  newTextField: {
    "& input": { fontSize: "32px", fontWeight: 400 },
    fontSize: "32px",
    fontStyle: "normal",
    fontWeight: 400,
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    padding: "0px",
  },
  balanceWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100px",
    paddingX: "8px",
    gap: "8px",
    [theme.breakpoints.down("sm")]: {
      gap: "4px",
    },
  },
  recommendWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
    [theme.breakpoints.down("sm")]: {
      gap: "4px",
    },
  },
  chipWrapper: {
    display: "flex",
    gap: "4px",
  },
  chipButton: {
    background: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "100%",
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.3),
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
  balanceTitle: {
    fontSize: "14px",
    maxLines: 1,
  },
  balanceContent: {
    fontSize: "14px",
    color: theme.palette.text.secondary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxLines: 1,
  },
  switchNetworkButton: {
    fontSize: "16px",
    fontWeight: 400,
    color: "black",
    lineHeight: "20px",
    textAlign: "left",
    textTransform: "none",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 12px",
    gap: "4px",
    background: "#F1F5F9",
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "160px",
    },
  },
  inputTitle: {
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0%",
    color: "#020617",
  },
  selectedNetworkTitle: {
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "24px",
    letterSpacing: "0%",
    maxLines: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "80px",
    },
  },
  madeNetworkWrapper: {
    fontSize: "16px",
    fontWeight: 400,
    color: "black",
    lineHeight: "20px",
    textAlign: "left",
    textTransform: "none",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 12px",
    gap: "4px",
    background: "#F1F5F9",
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "160px",
    },
  },
  helperText: {
    marginLeft: 0,
    textAlign: "left",
  },
  selectedTokenWrapper: {
    border: "1px solid #E2E8F0",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    gap: "2px",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      padding: "8px 4px",
      gap: "2px",
    },
  },
  topBalanceWrapper: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "end",
    gap: "4px",
    '@media (max-width: 400px)': {
      maxWidth: "200px",
    },
  },
}));
