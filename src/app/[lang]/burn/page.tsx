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
import { useAccount, useBalance, useChainId, useConfig } from "wagmi";
import {
  switchChain,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { CHAIN_ID_TO_ICON_MAP, CHAIN_ID_TO_JOCX_ADDRESS_MAP, CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP, CHAIN_ID_TO_USDCX_ADDRESS_MAP, CHAIN_ID_TO_USDTX_ADDRESS_MAP, ethereum, joc } from "@/wagmi/config";
import { Chain, formatUnits, parseUnits } from "viem";
import Layout from "@/components/Layout";
import TokenChangePopover from "@/components/TokenChangePopover";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { ethers } from "ethers";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import Image from "next/image";
import { Token } from "@/enums/token";
import { TOKEN_TO_DECIMALS_MAP, TOKEN_TO_ICON_MAP } from "@/utils/token.utils";
import { waitForMessageReceived } from "@x-gate-project/x-gate-scan-client";
import localStorageService from "@/services/local-storage.service";
import { isProduction } from "@/utils/system";
import { TransactionMethod } from "@/enums/transaction-method";
import { useTransactionState } from "@/contexts/TransactionStateContext";
import { renderTokenBalance } from "@/utils/render.util";
import { getFeeOverrides } from "@/utils/fee.utils";
import { JOCX_BURN_LZ_RECEIVE_GAS_LIMIT, OFTX_BURN_LZ_COMPOSE_GAS_LIMIT, OFTX_BURN_LZ_RECEIVE_GAS_LIMIT } from "@/consts/gas";
import SelectTokenDialog from "@/components/SelectTokenDialog";
import { readNoftxQuoteSend, readOftxQuoteSend, writeNoftxSend, writeOftxBurn, writeOftxSend } from "@/wagmi/generated";

const BURN_SUPPORT_TOKENS = [
  Token.USDTX,
  Token.USDCX,
  Token.JOCX,
]

export default function Burn() {
  const dict = useDict();
  const wagmiConfig = useConfig();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [burnAmount, setBurnAmount] = useState("");
  const resetBurnAmount = useCallback(() => setBurnAmount(""), []);
  const { classes } = useStyles();
  const { chainId } = useAccount();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [pageState, setPageState] = useState(localStorageService.getPageState());
  const fromToken = useMemo(() => pageState.burn.token as Token, [pageState]);
  const toToken = useMemo(() => {
    if(fromToken === Token.USDTX) {
      return Token.USDT;
    }

    if(fromToken === Token.USDCX) {
      return Token.USDC;
    }

    return Token.JOC;
  }, [fromToken]);
  const toNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === (pageState.burn.toChainId)) || ethereum, [pageState, wagmiConfig]);
  const fromNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === (pageState.burn.fromChainId)) || ethereum, [pageState, wagmiConfig]);
  const { data: fromTokenData, refetch: refetchFromTokenData } =
    useBalance({
      address,
      token: fromToken === Token.USDTX ?
        CHAIN_ID_TO_USDTX_ADDRESS_MAP[fromNetwork.id] as any
          : fromToken === Token.USDCX ?
        CHAIN_ID_TO_USDCX_ADDRESS_MAP[fromNetwork.id] as any
          : CHAIN_ID_TO_JOCX_ADDRESS_MAP[fromNetwork.id] as any,
      chainId: fromNetwork.id,
  });
  const { data: toTokenData, refetch: refetchToTokenData } =
    useBalance({
      address,
      token: toToken === Token.USDT ?
        process.env.NEXT_PUBLIC_USDT_ETHEREUM_ADDRESS as any :
        toToken === Token.USDC ?
          process.env.NEXT_PUBLIC_USDC_ETHEREUM_ADDRESS as any :
          undefined,
      chainId: toNetwork.id,
  });
  const { addTransaction, isBurning, setIsBurning } = useTransactionState();
  const displayDecimals = TOKEN_TO_DECIMALS_MAP[fromToken];
  const fromTokenBalance = fromTokenData ? renderTokenBalance(fromTokenData?.formatted, { displayDecimals }) : '';
  const toTokenBalance = toTokenData ? renderTokenBalance(toTokenData?.formatted, { displayDecimals }) : '';
  const insufficientBalance = burnAmount
    ? Number(burnAmount) > Number(fromTokenBalance)
    : false;

  const [openFromTokenChangeDialog, setOpenFromTokenChangeDialog] = useState(false);

  const onOpenFromTokenChangeDialog = useCallback(() => {
    setOpenFromTokenChangeDialog(true);
  }, [setOpenFromTokenChangeDialog]);
  const onCloseFromTokenChangeDialog = useCallback(() => {
    setOpenFromTokenChangeDialog(false);
  }, [setOpenFromTokenChangeDialog]);

  const handleMintAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const amount = event.target.value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${displayDecimals}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal
      setBurnAmount(amount);
    },
    [displayDecimals]
  );

  const handleSetMaxAmount = useCallback(() => {
    if (fromTokenBalance) {
      setBurnAmount(fromTokenBalance);
    }
  }, [fromTokenBalance]);

  const burnJOCX = useCallback(async () => {
    setIsBurning(true);
    const destinationChain = isProduction ? EndpointId.JOC_V2_MAINNET : EndpointId.JOC_V2_TESTNET;
    try {
      if (chainId !== fromNetwork.id) {
        await switchChain(wagmiConfig, { chainId: fromNetwork.id });
      }

      const tokensToBurn = ethers.parseEther(burnAmount);
      const options = Options.newOptions()
        .addExecutorLzReceiveOption(JOCX_BURN_LZ_RECEIVE_GAS_LIMIT, 0)
        .toHex()
        .toString();

      const sendParam = {
        dstEid: destinationChain,
        to: ethers.zeroPadValue(address as `0x${string}`, 32) as `0x${string}`,
        amountLD: tokensToBurn,
        minAmountLD: tokensToBurn,
        extraOptions: options as `0x${string}`,
        composeMsg: "0x" as `0x${string}`,
        oftCmd: "0x" as `0x${string}`,
      };

      const fee = await readNoftxQuoteSend(wagmiConfig, {
        address: CHAIN_ID_TO_JOCX_ADDRESS_MAP[fromNetwork.id] as any,
        args: [sendParam, false],
      });

      const burnTxHash = await writeNoftxSend(wagmiConfig, {
        address: CHAIN_ID_TO_JOCX_ADDRESS_MAP[fromNetwork.id] as any,
        args: [sendParam, {nativeFee: fee.nativeFee, lzTokenFee: BigInt(0)}, address as `0x${string}`],
        value: fee.nativeFee,
        ...(await getFeeOverrides(wagmiConfig, fromNetwork.id)),
      });

      enqueueSnackbar(
        dict.burn_tab.waiting_for_sending
          .replace("{{token}}", toToken)
          .replace("{{destination}}", toNetwork.name),
        { variant: "info" }
      );
      setIsBurning(false);
      resetBurnAmount();

      await addTransaction({
        hash: burnTxHash,
        summary: `Burn ${burnAmount} ${fromToken} from ${fromNetwork.name} to ${toNetwork.name}`,
        fromAddress: address as string,
        toAddress: address as string,
        fromChainId: fromNetwork.id,
        toChainId: toNetwork.id,
        amount: burnAmount,
        method: TransactionMethod.BURN,
        token: fromToken,
        lzEndpointId: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[toNetwork.id],
        createdAt: Date.now(),
      }, async () => {
        await waitForTransactionReceipt(wagmiConfig, {
          hash: burnTxHash,
        });
        await waitForMessageReceived(CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[toNetwork.id], burnTxHash);
      });

      refetchFromTokenData();
      refetchToTokenData();
      enqueueSnackbar(
        dict.burn_tab.burn_success
          .replace("{{token}}", fromToken)
          .replace("{{from}}", fromNetwork.name)
          .replace("{{to}}", toNetwork.name),
        { variant: "success" }
      );
    } catch (error) {
      console.log("Burn failded with error: ", error);
      enqueueSnackbar(
        dict.burn_tab.burn_failed
          .replace("{{token}}", fromToken)
          .replace("{{from}}", fromNetwork.name)
          .replace("{{to}}", toNetwork.name)
          .replace(
            "{{error}}",
            (error as any).shortMessage || dict.error_page.unknown_error
          ),
        { variant: "error", style: { whiteSpace: "pre-line" } }
      );
    } finally {
      setIsBurning(false);
    }
  }, [
    burnAmount,
    chainId,
    dict,
    enqueueSnackbar,
    toNetwork,
    refetchFromTokenData,
    resetBurnAmount,
    wagmiConfig,
    address,
    fromToken,
    refetchToTokenData,
    addTransaction,
    setIsBurning,
    fromNetwork,
    toToken,
  ]);


  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      if(!address) {
        return;
      }

      if(fromToken === Token.JOCX) {
        await burnJOCX();
        return;
      }

      setIsBurning(true);
      try {
        if (chainId !== fromNetwork.id) {
          await switchChain(wagmiConfig, { chainId: fromNetwork.id });
        }

        const isFromETH = fromNetwork.id === ethereum.id;

        if(!isFromETH && address) {
          const ethereumTokenAddress = fromToken === Token.USDTX ? CHAIN_ID_TO_USDTX_ADDRESS_MAP[ethereum.id] as any : CHAIN_ID_TO_USDCX_ADDRESS_MAP[ethereum.id] as any;
          const sourceTokenAddress = fromToken === Token.USDTX ? CHAIN_ID_TO_USDTX_ADDRESS_MAP[fromNetwork.id] as any : CHAIN_ID_TO_USDCX_ADDRESS_MAP[fromNetwork.id] as any;

          const options = Options.newOptions()
            .addExecutorLzReceiveOption(OFTX_BURN_LZ_RECEIVE_GAS_LIMIT, 0)
            .addExecutorComposeOption(0, OFTX_BURN_LZ_COMPOSE_GAS_LIMIT, 0)
            .toHex()
            .toString();

          const composeMessage = ethers.solidityPacked(
            ["uint16", "bytes32"],
            [1, ethers.zeroPadValue(address, 32)]
          );

          const destEndpointId = isProduction ? EndpointId.ETHEREUM_V2_MAINNET : EndpointId.SEPOLIA_V2_TESTNET;
          const sendParam = {
            dstEid: destEndpointId,
            to: ethers.zeroPadValue(ethereumTokenAddress, 32) as `0x${string}`,
            amountLD: ethers.parseUnits(burnAmount, 6),
            minAmountLD: ethers.parseUnits(burnAmount, 6),
            extraOptions: options as `0x${string}`,
            composeMsg: composeMessage as `0x${string}`,
            oftCmd: "0x" as `0x${string}`,
          };

          const fee = await readOftxQuoteSend(wagmiConfig, {
            address: sourceTokenAddress,
            args: [sendParam, false],
          });

          const sendTokenTxHash = await writeOftxSend(wagmiConfig, {
            address: sourceTokenAddress,
            args: [sendParam, {nativeFee: fee.nativeFee, lzTokenFee: BigInt(0)}, address],
            value: fee.nativeFee,
            ...(await getFeeOverrides(wagmiConfig, fromNetwork.id)),
          });
          enqueueSnackbar(
            dict.burn_tab.waiting_for_sending
              .replace("{{token}}", toToken)
              .replace("{{destination}}", toNetwork.name),
            { variant: "info" }
          );

          setIsBurning(false);
          resetBurnAmount();

          await addTransaction({
            hash: sendTokenTxHash,
            summary: `Burn ${burnAmount} ${fromToken} from ${fromNetwork.name} to ${toNetwork.name}`,
            fromAddress: address as string,
            toAddress: address as string,
            fromChainId: fromNetwork.id,
            toChainId: toNetwork.id,
            amount: burnAmount,
            method: TransactionMethod.BURN,
            token: fromToken,
            lzEndpointId: CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[toNetwork.id],
            createdAt: Date.now(),
          }, async () => {
            await waitForTransactionReceipt(wagmiConfig, {
              hash: sendTokenTxHash,
            });
            await waitForMessageReceived(CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[toNetwork.id], sendTokenTxHash);
          });
        } else {
          const hash = await writeOftxBurn(wagmiConfig, {
            address: fromToken === Token.USDTX ? CHAIN_ID_TO_USDTX_ADDRESS_MAP[toNetwork.id] as any : CHAIN_ID_TO_USDCX_ADDRESS_MAP[toNetwork.id] as any,
            args: [parseUnits(burnAmount, 6)],
          });

          setIsBurning(false);
          resetBurnAmount();

          await addTransaction({
            hash: hash,
            summary: `Burn ${burnAmount} ${fromToken} from ${fromNetwork.name} to ${ethereum.name}`,
            fromAddress: address as string,
            toAddress: address as string,
            fromChainId: fromNetwork.id,
            toChainId: toNetwork.id,
            amount: burnAmount,
            method: TransactionMethod.BURN,
            token: fromToken,
            createdAt: Date.now(),
          }, async () => {
            await waitForTransactionReceipt(wagmiConfig, {
              hash,
            });
          });
        }

        refetchFromTokenData();
        refetchToTokenData();
        enqueueSnackbar(
          dict.burn_tab.burn_success
            .replace("{{token}}", fromToken)
            .replace("{{from}}", toNetwork.name)
            .replace("{{to}}", toNetwork.name),
          { variant: "success" }
        );
      } catch (error) {
        console.log("Burn failded with error: ", error);
        enqueueSnackbar(
          dict.burn_tab.burn_failed.replace("{{token}}", fromToken)
            .replace("{{from}}", fromNetwork.name)
            .replace("{{to}}", toNetwork.name)
            .replace("{{error}}", (error as any).shortMessage || dict.error_page.unknown_error),
          { variant: "error", style: { whiteSpace: "pre-line" } }
        );
      } finally {
        setIsBurning(false);
      }
    },
    [
      burnAmount,
      chainId,
      dict,
      enqueueSnackbar,
      toNetwork,
      refetchFromTokenData,
      resetBurnAmount,
      wagmiConfig,
      address,
      fromToken,
      refetchToTokenData,
      addTransaction,
      setIsBurning,
      burnJOCX,
      fromNetwork,
      toToken,
    ]
  );

  const handleSelectToken = useCallback((token: Token, network: Chain) => {
    const pageState = localStorageService.setPageState({
      burnToken: token,
      burnFromChainId: network.id,
      burnToChainId: token === Token.JOCX ? joc.id : ethereum.id,
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
                      {dict.burn_tab.burn}
                    </Box>
                  </Box>
                  {fromTokenBalance &&
                    <div className={classes.topBalanceWrapper}>
                      <Box color="#64748B" fontSize={14}>{dict.burn_tab.balance}:</Box>
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
                    placeholder="0"
                    InputProps={{
                      sx: { paddingRight: "0px" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <div className={classes.recommendWrapper}>
                            <div className={classes.chipWrapper}>
                              <Chip
                                onClick={handleSetMaxAmount}
                                label={dict.burn_tab.max}
                                className={classes.chipButton}
                              />
                            </div>
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
                    className={classes.newTextField}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "0px",
                      },
                    }}
                    autoFocus
                    size="medium"
                    value={burnAmount}
                    onChange={handleMintAmountChange}
                    inputProps={{ "data-testid": "amount-input" }}
                    error={insufficientBalance}
                    helperText={insufficientBalance && dict.burn_tab.invalid_amount}
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
                borderRadius="20px"
                padding="16px"
                sx={{ backgroundColor: "#E2E8F0" }}
              >
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="4px">
                  <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                    <Box className={classes.inputTitle}>
                      {dict.burn_tab.out}
                    </Box>
                  </Box>
                  {toTokenBalance &&
                    <div className={classes.topBalanceWrapper}>
                      <Box color="#64748B" fontSize={14}>{dict.mint_tab.balance}:</Box>
                      <Box color="#64748B"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap">
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
                                sx={{ backgroundColor: "white" }}
                                borderRadius={8}
                                display={"flex"}
                                alignItems={"center"}
                                padding={"8px 12px"}
                                gap="2px"
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
                    value={burnAmount}
                    name="to"
                    inputProps={{ "data-testid": "to-input" }}
                  />
                </Box>
              </Box>
            </div>
          </div>
          <Button
              variant="contained"
              className={classes.burnButton}
              type="submit"
              color="primary"
              startIcon={isBurning ? <CircularProgress color="inherit" size={24} /> : undefined}
              disabled={
                isBurning ||
                !burnAmount ||
                insufficientBalance ||
                isDisconnected ||
                isConnecting
              }
            >
              {dict.burn_tab.button}
          </Button>
        </div>
      </form>
      <SelectTokenDialog
        open={openFromTokenChangeDialog}
        onClose={onCloseFromTokenChangeDialog}
        onChangeToken={handleSelectToken}
        selectedToken={fromToken}
        networks={wagmiConfig.chains as any}
        tokens={BURN_SUPPORT_TOKENS}
        selectedNetwork={fromNetwork}
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
  burnButton: {
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
    lineHeight: "20px",
    letterSpacing: 0,
  },
  madeNetworkWrapper: {
    fontSize: "16px",
    fontWeight: 400,
    color: "black",
    lineHeight: "20px",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 12px",
    gap: "4px",
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
