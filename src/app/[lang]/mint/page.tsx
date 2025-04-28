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
  useTheme,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import { useDict } from "@/contexts/DictContext";
import { useSnackbar } from "notistack";
import TokenWithChainIcon from "@/components/TokenWithChainIcon";
import {
  useAccount,
  useBalance,
  useChainId,
  useConfig,
} from "wagmi";
import {
  switchChain,
  writeContract,
  waitForTransactionReceipt,
  readContract,
} from "wagmi/actions";
import { CHAIN_ID_TO_ICON_MAP, CHAIN_ID_TO_JOCX_ADDRESS_MAP, CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP, CHAIN_ID_TO_USDCX_ADDRESS_MAP, CHAIN_ID_TO_USDTX_ADDRESS_MAP, ethereum, joc } from "@/wagmi.config";
import { Chain, parseEther, parseUnits } from "viem";
import usdtxAbi from "@/libs/usdtx/abis/UsdtxAbi.json";
import erc20Abi from "@/libs/usdtx/abis/Erc20Abi.json";
import Layout from "@/components/Layout";
import TokenChangePopover from "@/components/TokenChangePopover";
import Image from "next/image";
import { Token } from "@/enums/token";
import { TOKEN_TO_DECIMALS_MAP, TOKEN_TO_ICON_MAP } from "@/utils/token.utils";
import localStorageService from "@/services/local-storage.service";
import { waitForMessageReceived } from "@layerzerolabs/scan-client";
import { ethers } from "ethers";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import oftxHelperAbi from "@/libs/usdtx/abis/OFTXHelperAbi.json";
import jocxAdapterAbi from "@/libs/jocx/abis/JOCXAdapter.json";
import { TransactionMethod } from "@/enums/transaction-method";
import { useTransactionState } from "@/contexts/TransactionStateContext";
import { renderTokenBalance } from "@/utils/render.util";

const MINT_SUPPORT_TOKENS = [
  Token.USDT,
  Token.USDC,
  Token.JOC
]

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
  const fromToken = useMemo(() => pageState.mint.token as Token, [pageState]);
  const toToken = useMemo(() => {
    if (fromToken === Token.USDT) {
      return Token.USDTX;
    }

    if (fromToken === Token.USDC) {
      return Token.USDCX;
    }

    return Token.JOCX;
  }, [fromToken]);
  const fromNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === (pageState.mint.fromChainId)) || ethereum, [pageState, wagmiConfig]);
  const toNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === (pageState.mint.toChainId)) || ethereum, [pageState, wagmiConfig]);
  const [selectToTokenNetworkPopoverAnchorEl, setSelectToTokenNetworkPopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [tokenChangePopoverAnchorEl, setTokenChangePopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const { data: fromTokenData, refetch: refetchFromTokenBalance } =
    useBalance({
      address,
      token: fromToken === Token.USDT ?
        process.env.NEXT_PUBLIC_USDT_ETHEREUM_ADDRESS as any :
        fromToken === Token.USDC ?
          process.env.NEXT_PUBLIC_USDC_ETHEREUM_ADDRESS as any :
          undefined,
      chainId: fromNetwork.id,
    });
  const { data: toTokenData, refetch: refetchToTokenBalance } = useBalance({
    address,
    token: toToken === Token.USDTX ?
      CHAIN_ID_TO_USDTX_ADDRESS_MAP[toNetwork.id] as any :
      toToken === Token.USDCX ?
        CHAIN_ID_TO_USDCX_ADDRESS_MAP[toNetwork.id] as any :
        CHAIN_ID_TO_JOCX_ADDRESS_MAP[toNetwork.id] as any,
    chainId: toNetwork.id,
  });
  const { addTransaction, isMinting, setIsMinting } = useTransactionState();
  const displayDecimals = TOKEN_TO_DECIMALS_MAP[fromToken];
  const fromTokenBalance = fromTokenData ?  renderTokenBalance(fromTokenData?.formatted, { displayDecimals }) : '';
  const toTokenBalance = toTokenData ?  renderTokenBalance(toTokenData?.formatted, { displayDecimals }) : '';;
  const insufficientBalance = mintAmount
    ? Number(mintAmount) > Number(fromTokenBalance)
    : false;

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
      .addExecutorLzReceiveOption(200000, 0)
      .toHex()
      .toString();

      const sendParam = [
        CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[toNetwork.id],
        ethers.zeroPadValue(address, 32),
        tokensToMint,
        tokensToMint,
        options,
        "0x",
        "0x",
      ];

      const fee: any = await readContract(wagmiConfig, {
        abi: jocxAdapterAbi,
        address: process.env.NEXT_PUBLIC_JOCX_ADAPTER_JOC_ADDRESS as `0x${string}`,
        functionName: 'quoteSend',
        args: [sendParam, false],
      });

      const mintTokenTxHash = await writeContract(wagmiConfig, {
        address: process.env.NEXT_PUBLIC_JOCX_ADAPTER_JOC_ADDRESS as `0x${string}`,
        abi: jocxAdapterAbi,
        functionName: 'send',
        args: [
          sendParam,
          [fee.nativeFee, 0],
          address,
        ],
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


  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      if (!address) {
        return;
      }

      if (fromToken === Token.JOC) {
        await mintJOCX(address);
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
          const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()

          const sendParam = [
              CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[toNetwork.id],
              ethers.zeroPadValue(address, 32),
              parseUnits(mintAmount, 6),
              parseUnits(mintAmount, 6),
              options,
              '0x',
              '0x',
          ]

          const fee: any = await readContract(wagmiConfig, {
            abi: usdtxAbi,
            address: destinationTokenAddress as `0x${string}`,
            functionName: "quoteSend",
            args: [sendParam, false],
          });

          const allowance = await readContract(wagmiConfig, {
            address: sourceTokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "allowance",
            args: [address, process.env.NEXT_PUBLIC_OFTX_HELPER_ADDRESS!],
          });

          if((allowance as bigint) !== parseUnits(mintAmount, 6)) {
            if(allowance !== BigInt(0) && fromToken === Token.USDT) {
              const approveTokenToZeroTxHash = await writeContract(wagmiConfig, {
                abi: erc20Abi,
                address: sourceTokenAddress as `0x${string}`,
                functionName: "approve",
                args: [
                  process.env.NEXT_PUBLIC_OFTX_HELPER_ADDRESS as any,
                  0,
                ],
              });

              await waitForTransactionReceipt(wagmiConfig, {
                hash: approveTokenToZeroTxHash,
              });
            }

            const approveTokenTxHash = await writeContract(wagmiConfig, {
              abi: erc20Abi,
              address: sourceTokenAddress as `0x${string}`,
              functionName: "approve",
              args: [
                process.env.NEXT_PUBLIC_OFTX_HELPER_ADDRESS as any,
                parseUnits(mintAmount, 6),
              ],
            });
            await waitForTransactionReceipt(wagmiConfig, {
              hash: approveTokenTxHash,
            });
          }

          const mintTokenTxHash = await writeContract(wagmiConfig, {
            abi: oftxHelperAbi,
            address: process.env.NEXT_PUBLIC_OFTX_HELPER_ADDRESS as any,
            functionName: "mintAndSendOFTX",
            args: [destinationTokenAddress, sendParam, [fee.nativeFee, 0], address],
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
          const allowance = await readContract(wagmiConfig, {
            address: sourceTokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "allowance",
            args: [address, destinationTokenAddress],
          });
          if((allowance as bigint) !== parseUnits(mintAmount, 6)) {
            if(allowance !== BigInt(0) && fromToken === Token.USDT) {
              const approveTokenToZeroTxHash = await writeContract(wagmiConfig, {
                abi: erc20Abi,
                address: sourceTokenAddress as `0x${string}`,
                functionName: "approve",
                args: [
                  destinationTokenAddress,
                  0,
                ],
              });
              await waitForTransactionReceipt(wagmiConfig, {
                hash: approveTokenToZeroTxHash,
              });
            }

            const approveTokenTxHash = await writeContract(wagmiConfig, {
              abi: erc20Abi,
              address: sourceTokenAddress as `0x${string}`,
              functionName: "approve",
              args: [
                destinationTokenAddress,
                parseUnits(mintAmount, 6),
              ],
            });
            await waitForTransactionReceipt(wagmiConfig, {
              hash: approveTokenTxHash,
            });
          }

          console.log(`Approved ${toToken} successfully. Minting ${toToken} ...`);

          const mintTokenTxHash = await writeContract(wagmiConfig, {
            abi: usdtxAbi,
            address:
              fromToken === Token.USDT
                ? (process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS as any)
                : (process.env.NEXT_PUBLIC_USDCX_ETHEREUM_ADDRESS as any),
            functionName: "mint",
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
    ]
  );


  const onOpenSelectToTokenNetworkPopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setSelectToTokenNetworkPopoverAnchorEl(event.currentTarget);
    },
    [setSelectToTokenNetworkPopoverAnchorEl],
  );
  const onCloseSelectToTokenNetworkPopover = useCallback(() => {
    setSelectToTokenNetworkPopoverAnchorEl(null);
  }, [setSelectToTokenNetworkPopoverAnchorEl]);

  const onOpenTokenChangePopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setTokenChangePopoverAnchorEl(event.currentTarget);
    },
    [setTokenChangePopoverAnchorEl],
  );
  const onCloseTokenChangePopover = useCallback(() => {
    setTokenChangePopoverAnchorEl(null);
  }, [setTokenChangePopoverAnchorEl]);

  const handleSelectFromToken = useCallback((token: Token, network: Chain) => {
    const pageState = localStorageService.setPageState({
      mintToken: token,
      mintFromChainId: network.id,
      mintToChainId: token === Token.JOC && toNetwork.id === joc.id ? ethereum.id : undefined,
    });
    setPageState(pageState);
  }, [setPageState, toNetwork]);

  const handleSelectToToken = useCallback((token: Token, network: Chain) => {
    const pageState = localStorageService.setPageState({
      mintToChainId: network.id,
    });
    setPageState(pageState);
  }, [setPageState]);


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
                            <div className={classes.chipWrapper}>
                              <Chip
                                onClick={handleSetMaxAmount}
                                label={dict.mint_tab.max}
                                className={classes.chipButton}
                              />
                            </div>
                            <div className={classes.balanceWrapper}>
                              <div
                                className={classes.selectedTokenWrapper}
                                onClick={onOpenTokenChangePopover}
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
                                onClick={onOpenSelectToTokenNetworkPopover}
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
      <TokenChangePopover
        open={Boolean(selectToTokenNetworkPopoverAnchorEl)}
        onClose={onCloseSelectToTokenNetworkPopover}
        onChangeToken={handleSelectToToken}
        anchorEl={selectToTokenNetworkPopoverAnchorEl}
        selectedToken={toToken}
        networks={wagmiConfig.chains as any}
        tokens={[toToken]}
        selectedNetwork={toNetwork}
      />
      <TokenChangePopover
        open={Boolean(tokenChangePopoverAnchorEl)}
        onClose={onCloseTokenChangePopover}
        onChangeToken={handleSelectFromToken}
        anchorEl={tokenChangePopoverAnchorEl}
        selectedToken={fromToken}
        networks={[ethereum]}
        tokens={MINT_SUPPORT_TOKENS}
        selectedNetwork={fromNetwork}
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
