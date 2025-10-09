"use client";

import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Button,
  TextField,
  Chip,
  CircularProgress,
  Box,
  alpha,
  InputAdornment,
  FormControlLabel,
  Tooltip,
  Checkbox,
  IconButton,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import { useDict } from "@/contexts/DictContext";
import TokenWithChainIcon from "@/components/TokenWithChainIcon";
import { useAccount, useBalance, useChainId, useConfig } from "wagmi";
import Layout from "@/components/Layout";
import { CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP, CHAIN_ID_TO_ICON_MAP, CHAIN_ID_TO_USDTX_ADDRESS_MAP, ethereum, joc, CHAIN_ID_TO_USDCX_ADDRESS_MAP, CHAIN_ID_TO_JOCX_ADDRESS_MAP } from "@/wagmi/config";
import {
  waitForTransactionReceipt,
} from "wagmi/actions";
import { useSnackbar } from "notistack";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { Chain, parseUnits } from "viem";
import { ethers } from "ethers";
import TokenChangePopover from "@/components/TokenChangePopover";
import { waitForMessageReceived } from '@layerzerolabs/scan-client';
import { Token } from "@/enums/token";
import { TOKEN_TO_DECIMALS_MAP, TOKEN_TO_ICON_MAP } from "@/utils/token.utils";
import localStorageService from "@/services/local-storage.service";
import { switchChain } from "wagmi/actions";
import { useTransactionState } from "@/contexts/TransactionStateContext";
import { TransactionMethod } from "@/enums/transaction-method";
import { renderTokenBalance } from "@/utils/render.util";
import { JOCX_SEND_LZ_RECEIVE_GAS_LIMIT, OFTX_SEND_LZ_RECEIVE_GAS_LIMIT } from "@/consts/gas";
import SelectTokenDialog from "@/components/SelectTokenDialog";
import { readNoftxQuoteSend, readOftxQuoteSend, writeNoftxSend, writeOftxSend } from "@/wagmi/generated";

const SEND_SUPPORT_TOKENS = [
  Token.USDTX,
  Token.USDCX,
  Token.JOCX,
]

export default function Send() {
  const dict = useDict();
  const [sendAmount, setSendAmount] = useState("");
  const resetSendAmount = useCallback(() => setSendAmount(""), []);
  const { classes } = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const wagmiConfig = useConfig();
  const { address, isConnected } = useAccount();
  const [pageState, setPageState] = useState(localStorageService.getPageState());
  const selectedFromNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === (pageState.send.fromChainId)) || ethereum, [pageState, wagmiConfig]);
  const selectedToNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === (pageState.send.toChainId)) || joc, [pageState, wagmiConfig]);
  const selectedToken = useMemo(() => pageState.send.token as Token, [pageState]);
  const [receiveAddress, setReceiveAddress] = useState("");
  const [isSendToAnotherWallet, setIsSendToAnotherWallet] = useState(false);
  const { data: fromTokenData, refetch: refetchFromTokenBalance } = useBalance({
    address,
    token: selectedToken === Token.USDTX ?
      CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedFromNetwork.id] as any :
      selectedToken === Token.USDCX ?
        CHAIN_ID_TO_USDCX_ADDRESS_MAP[selectedFromNetwork.id] as any :
        CHAIN_ID_TO_JOCX_ADDRESS_MAP[selectedFromNetwork.id] as any,
    chainId: selectedFromNetwork.id,
  });
  const { data: toTokenData, refetch: refetchToTokenBalance } = useBalance({
    address,
    token: selectedToken === Token.USDTX ?
      CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedToNetwork.id] as any :
      selectedToken === Token.USDCX ?
        CHAIN_ID_TO_USDCX_ADDRESS_MAP[selectedToNetwork.id] as any :
        CHAIN_ID_TO_JOCX_ADDRESS_MAP[selectedToNetwork.id] as any,
    chainId: selectedToNetwork.id,
  });
  const { chainId } = useAccount();
  const { addTransaction, isSending, setIsSending } = useTransactionState();
  const displayDecimals = TOKEN_TO_DECIMALS_MAP[selectedToken];
  const fromTokenBalance = fromTokenData ? renderTokenBalance(fromTokenData?.formatted, { displayDecimals }) : '';
  const toTokenBalance = toTokenData ? renderTokenBalance(toTokenData?.formatted, { displayDecimals }) : '';
  const insufficientBalance = sendAmount
    ? Number(sendAmount) >
      Number(fromTokenBalance)
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

  const handleSendAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const amount = event.target.value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${displayDecimals}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal
      setSendAmount(amount);
    },
    [displayDecimals]
  );

  const swapFromAndToNetwork = useCallback(() => {
    const pageState = localStorageService.setPageState({
      sendFromChainId: selectedToNetwork.id,
      sendToChainId: selectedFromNetwork.id,
    });
    setPageState(pageState);
  }, [selectedFromNetwork, selectedToNetwork]);

  const handleSetMaxAmount = useCallback(() => {
    if (fromTokenBalance) {
      setSendAmount(fromTokenBalance);
    }
  }, [fromTokenBalance]);

  const sendJOCX = useCallback(async (receiverAddress: `0x${string}`, address: `0x${string}`) => {
      setIsSending(true);
      try {
        if (selectedFromNetwork.id !== chainId) {
          await switchChain(wagmiConfig, { chainId: selectedFromNetwork.id });
        }

        const sourceTokenAddress = CHAIN_ID_TO_JOCX_ADDRESS_MAP[selectedFromNetwork.id] as any;
        const destChain = CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[selectedToNetwork.id];

        const tokensToSend = ethers.parseEther(sendAmount);
        const options = Options.newOptions()
          .addExecutorLzReceiveOption(JOCX_SEND_LZ_RECEIVE_GAS_LIMIT, 0)
          .toHex()
          .toString();

        const sendParam = {
          dstEid: destChain,
          to: ethers.zeroPadValue(receiverAddress, 32) as `0x${string}`,
          amountLD: tokensToSend,
          minAmountLD: tokensToSend,
          extraOptions: options as `0x${string}`,
          composeMsg: "0x" as `0x${string}`,
          oftCmd: "0x" as `0x${string}`,
        };

        const fee = await readNoftxQuoteSend(wagmiConfig, {
          address: sourceTokenAddress as `0x${string}`,
          args: [sendParam, false],
        });

        const sendTokenTxHash = await writeNoftxSend(wagmiConfig, {
          address: sourceTokenAddress as `0x${string}`,
          args: [sendParam, {nativeFee: fee.nativeFee, lzTokenFee: BigInt(0)}, address as `0x${string}`],
          value: fee.nativeFee,
        });
        setIsSending(false);
        enqueueSnackbar( dict.send_tab.waiting_for_sending, { variant: "info" });

        resetSendAmount();

        await addTransaction({
          hash: sendTokenTxHash,
          summary: `Send ${sendAmount} ${selectedToken} from ${selectedFromNetwork.name} to ${selectedToNetwork.name}`,
          fromAddress: address,
          toAddress: receiverAddress,
          fromChainId: selectedFromNetwork.id,
          toChainId: selectedToNetwork.id,
          amount: sendAmount,
          method: TransactionMethod.SEND,
          token: selectedToken,
          lzEndpointId: destChain,
          createdAt: Date.now(),
        }, async () => {
          await waitForTransactionReceipt(wagmiConfig, {
            hash: sendTokenTxHash,
          });
          await waitForMessageReceived(destChain, sendTokenTxHash);
        });

        refetchFromTokenBalance();
        refetchToTokenBalance();
        enqueueSnackbar(
          dict.send_tab.send_success
            .replace("{{token}}", selectedToken)
            .replace("{{from}}", selectedFromNetwork.name)
            .replace("{{to}}", selectedToNetwork.name),
          { variant: "success" }
        );
      } catch (error) {
        console.log(`Send ${selectedToken} failded with error: ${error}`);
        enqueueSnackbar(
          dict.send_tab.send_failed
            .replace("{{token}}", selectedToken)
            .replace("{{from}}", selectedFromNetwork.name)
            .replace("{{to}}", selectedToNetwork.name)
            .replace("{{error}}", (error as any).shortMessage || "Unknown error"),
          { variant: "error", style: { whiteSpace: "pre-line" } }
        );
      } finally {
        setIsSending(false);
      }
  }, [
    enqueueSnackbar,
    refetchFromTokenBalance,
      resetSendAmount,
      sendAmount,
      wagmiConfig,
      selectedFromNetwork,
      selectedToNetwork,
      selectedToken,
      dict,
      refetchToTokenBalance,
      addTransaction,
      setIsSending,
      chainId,
  ]);

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      if (!address) {
        return;
      }
      const receiverAddress = isSendToAnotherWallet ? receiveAddress : address;
      if (selectedToken === Token.JOCX) {
        await sendJOCX(receiverAddress as `0x${string}`, address as `0x${string}`);
        return;
      }
      setIsSending(true);
      try {
        if (selectedFromNetwork.id !== chainId) {
          await switchChain(wagmiConfig, { chainId: selectedFromNetwork.id });
        }

        const options = Options.newOptions()
          .addExecutorLzReceiveOption(OFTX_SEND_LZ_RECEIVE_GAS_LIMIT, 0)
          .toHex()
          .toString();
        const sourceTokenAddress =
          selectedToken === Token.USDTX
            ? (CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedFromNetwork.id] as any)
            : (CHAIN_ID_TO_USDCX_ADDRESS_MAP[selectedFromNetwork.id] as any);
        const composeMessage = "0x";
        const destChain = CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[selectedToNetwork.id];

        const sendParam = {
          dstEid: destChain,
          to: ethers.zeroPadValue(receiverAddress, 32) as `0x${string}`,
          amountLD: parseUnits(sendAmount, 6),
          minAmountLD: parseUnits(sendAmount, 6),
          extraOptions: options as `0x${string}`,
          composeMsg: composeMessage as `0x${string}`,
          oftCmd: "0x" as `0x${string}`,
        }

        const fee = await readOftxQuoteSend(wagmiConfig, {
          address: sourceTokenAddress as `0x${string}`,
          args: [sendParam, false],
        });

        const sendTokenTxHash = await writeOftxSend(wagmiConfig, {
          address: sourceTokenAddress as `0x${string}`,
          args: [sendParam, {nativeFee: fee.nativeFee, lzTokenFee: BigInt(0)}, address as `0x${string}`],
          value: fee.nativeFee,
        });

        setIsSending(false);
        enqueueSnackbar( dict.send_tab.waiting_for_sending, { variant: "info" });

        resetSendAmount();

        await addTransaction({
          hash: sendTokenTxHash,
          summary: `Send ${sendAmount} ${selectedToken} from ${selectedFromNetwork.name} to ${selectedToNetwork.name}`,
          fromAddress: address,
          toAddress: receiverAddress,
          fromChainId: selectedFromNetwork.id,
          toChainId: selectedToNetwork.id,
          amount: sendAmount,
          method: TransactionMethod.SEND,
          token: selectedToken,
          lzEndpointId: destChain,
          createdAt: Date.now(),
        }, async () => {
          await waitForTransactionReceipt(wagmiConfig, {
            hash: sendTokenTxHash,
          });
          await waitForMessageReceived(destChain, sendTokenTxHash);
        });

        refetchFromTokenBalance();
        refetchToTokenBalance();
        enqueueSnackbar(
          dict.send_tab.send_success
            .replace("{{token}}", selectedToken)
            .replace("{{from}}", selectedFromNetwork.name)
            .replace("{{to}}", selectedToNetwork.name),
          { variant: "success" }
        );
      } catch (error) {
        console.log(`Send ${selectedToken} failded with error: ${error}`);
        enqueueSnackbar(
          dict.send_tab.send_failed
            .replace("{{token}}", selectedToken)
            .replace("{{from}}", selectedFromNetwork.name)
            .replace("{{to}}", selectedToNetwork.name)
            .replace("{{error}}", (error as any).shortMessage || "Unknown error"),
          { variant: "error", style: { whiteSpace: "pre-line" } }
        );
      } finally {
        setIsSending(false);
      }
    },
    [
      address,
      enqueueSnackbar,
      refetchFromTokenBalance,
      resetSendAmount,
      sendAmount,
      wagmiConfig,
      selectedFromNetwork,
      selectedToNetwork,
      isSendToAnotherWallet,
      receiveAddress,
      selectedToken,
      dict,
      chainId,
      refetchToTokenBalance,
      addTransaction,
      setIsSending,
      sendJOCX
    ]
  );

  const handleSendToAnotherWalletCheckboxChange = useCallback((event: SyntheticEvent<Element, Event>, checked: boolean) => {
    setIsSendToAnotherWallet(checked);
  }, []);

  const handleReceiveAddressChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiveAddress(event.target.value);
  }, []);

  const handleSelectToToken = useCallback((token: Token, network: Chain) => {
    const pageState = localStorageService.setPageState({
      sendToChainId: network.id,
    });
    setPageState(pageState);
  }, [setPageState]);

  const handleSelectFromToken = useCallback((token: Token, network: Chain) => {
    const pageState = localStorageService.setPageState({
      sendToken: token,
      sendFromChainId: network.id,
      sendToChainId: token === Token.JOCX && selectedToNetwork.id === joc.id ? ethereum.id : network.id,
    });
    setPageState(pageState);
  }, [setPageState, selectedToNetwork]);

  useEffect(() => {
    if (selectedFromNetwork.id === selectedToNetwork.id) {
      const anotherNetwork = selectedToken === Token.JOCX ? wagmiConfig.chains.find((chain) => chain.id !== selectedFromNetwork.id && chain.id !== joc.id) : wagmiConfig.chains.find((chain) => chain.id !== selectedFromNetwork.id);
      const pageState = localStorageService.setPageState({
        sendToChainId: anotherNetwork?.id,
      });
      setPageState(pageState);
    }
  }, [selectedFromNetwork, wagmiConfig, setPageState, selectedToNetwork, selectedToken]);

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
                      {dict.send_tab.from}
                    </Box>
                  </Box>
                  {fromTokenBalance &&
                    <Tooltip title={fromTokenBalance}>
                      <div className={classes.topBalanceWrapper}>
                        <Box color="#64748B" fontSize={14}>{dict.send_tab.balance}:</Box>
                        <Box color="#64748B">
                          {fromTokenBalance}
                        </Box>
                      </div>
                    </Tooltip>
                  }
                </Box>
                <Box width="100%" display="flex" alignItems="start" justifyContent="center" flexDirection="column">
                  <TextField
                    fullWidth
                    placeholder="0"
                    variant="outlined"
                    value={sendAmount}
                    onChange={handleSendAmountChange}
                    InputProps={{
                      sx: { paddingRight: "0px" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <div className={classes.recommendWrapper}>
                            <div className={classes.chipWrapper}>
                              <Chip
                                onClick={handleSetMaxAmount}
                                label={dict.send_tab.max}
                                className={classes.chipButton}
                              />
                            </div>
                            <div
                                className={classes.selectedTokenWrapper}
                                onClick={onOpenFromTokenChangeDialog}
                              >
                                <TokenWithChainIcon
                                    tokenIcon={TOKEN_TO_ICON_MAP[selectedToken]}
                                    chainIcon={CHAIN_ID_TO_ICON_MAP[selectedFromNetwork.id]}
                                    width={24}
                                    height={24}
                                  />
                                <Box paddingLeft="2px" color="black">
                                  {selectedToken}
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                  <Image src="/icons/caret-sort.svg" alt="USDT" width={16} height={16} />
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
                    autoFocus
                    size="medium"
                    name="from"
                    inputProps={{ "data-testid": "from-input" }}
                    error={insufficientBalance}
                    helperText={insufficientBalance && dict.send_tab.invalid_amount}
                    FormHelperTextProps={{
                      className: classes.helperText,
                    }}
                  />
                </Box>
              </Box>
            </div>

            <IconButton
                sx={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={swapFromAndToNetwork}
            >
              <Image
                alt="Icon"
                src={"/icons/arrow-forward-down.svg"}
                width={16}
                height={16}
              />
            </IconButton>

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
                    <div className={classes.inputTitle}>
                      {dict.send_tab.to}
                    </div>
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
                                border="1px solid #E2E8F0"
                                borderRadius={8}
                                display={"flex"}
                                alignItems={"center"}
                                padding={"8px 12px"}
                                sx={{
                                  cursor: "pointer",
                                }}
                                gap="2px"
                                onClick={onOpenToTokenChangeDialog}
                              >
                                <TokenWithChainIcon
                                    tokenIcon={TOKEN_TO_ICON_MAP[selectedToken]}
                                    chainIcon={CHAIN_ID_TO_ICON_MAP[selectedToNetwork.id]}
                                    width={24}
                                    height={24}
                                  />
                                <Box paddingLeft="2px" color="black">
                                  {selectedToken}
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
                    value={sendAmount}
                    name="to"
                    inputProps={{ "data-testid": "to-input" }}
                  />
                </Box>
              </Box>
            </div>

            <div className={classes.itemWrapper}>
              <Box width="100%" display="flex" justifyContent="start" flexDirection="column">
                <FormControlLabel
                  data-testid="agree-check-box-label"
                  control={
                    <Checkbox
                      sx={{
                        margin: 0,
                        padding: 0,
                        gap: 0,
                      }}
                      data-testid="agree-check-box"
                    />
                  }
                  checked={isSendToAnotherWallet}
                  label={
                    <div className={classes.inputTitle}>
                      {dict.send_tab.another_wallet_address}
                    </div>
                  }
                  onChange={handleSendToAnotherWalletCheckboxChange}
                  sx={{
                    margin: '0px',
                    gap: '4px',
                  }}
                />
                {isSendToAnotherWallet && <TextField
                  fullWidth
                  placeholder={dict.send_tab.receive_address_placeholder}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                    },
                    "& .MuiInputBase-input": {
                      paddingLeft: "24px",
                    },
                    paddingTop: '6px',
                  }}
                  disabled={!isSendToAnotherWallet}
                  className={classes.addressTextField}
                  onChange={handleReceiveAddressChange}
                  size="small"
                  value={receiveAddress}
                  name="to"
                  inputProps={{ "data-testid": "address-input" }}
                  error={!ethers.isAddress(receiveAddress) && receiveAddress !== ""}
                  helperText={!ethers.isAddress(receiveAddress) && receiveAddress !== "" && dict.send_tab.invalid_receive_address}
                />}
              </Box>
            </div>
          </div>
          <Button
            variant="contained"
            className={classes.sendButton}
            type="submit"
            color="primary"
            startIcon={isSending ? <CircularProgress color="inherit" size={24} /> : undefined}
            disabled={
              isSending ||
              !sendAmount ||
              insufficientBalance ||
              !isConnected ||
              (isSendToAnotherWallet && (!ethers.isAddress(receiveAddress) || receiveAddress === ""))
              || selectedFromNetwork.id === selectedToNetwork.id
            }
          >
            {dict.send_tab.button}
          </Button>
        </div>
      </form>
      <SelectTokenDialog
        open={openFromTokenChangeDialog}
        onClose={onCloseFromTokenChangeDialog}
        onChangeToken={handleSelectFromToken}
        selectedToken={selectedToken}
        networks={wagmiConfig.chains as any}
        selectedNetwork={selectedFromNetwork}
        tokens={SEND_SUPPORT_TOKENS}
        isFrom={true}
      />
      <SelectTokenDialog
        open={openToTokenChangeDialog}
        onClose={onCloseToTokenChangeDialog}
        onChangeToken={handleSelectToToken}
        selectedToken={selectedToken}
        tokens={SEND_SUPPORT_TOKENS.filter((token) => token === selectedToken)}
        selectedNetwork={selectedToNetwork}
        networks={wagmiConfig.chains.filter((chain) => chain.id !== selectedFromNetwork.id)}
        isFrom={false}
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
    position: "relative",
    alignItems: "center",
  },
  itemWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "start",
    width: "100%",
  },
  sendButton: {
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
  addressTextField: {
    "& input": { fontSize: "16px", fontWeight: 400, color: "#64748B", },
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
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
    color: theme.palette.text.secondary,
    maxLines: 1,
  },
  balanceContent: {
    fontSize: "14px",
    color: theme.palette.text.secondary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxLines: 1,
  },
  dividerWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "4px",
    paddingRight: "4px",
  },
  divider: {
    color: theme.palette.divider,
    display: "flex",
    flex: 1,
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
      maxWidth: "115px",
    },
  },
  inputTitle: {
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0%",
    color: "#020617",
  },
  addressTitle: {
    fontSize: "14px",
    color: '#64748B',
  },
  checkbox: {
    padding: "0px",
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
