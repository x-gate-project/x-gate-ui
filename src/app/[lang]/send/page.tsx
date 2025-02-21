"use client";

import React, { SyntheticEvent, useCallback, useState } from "react";
import Image from "next/image";
import {
  Button,
  TextField,
  Chip,
  CircularProgress,
  Box,
  alpha,
  InputAdornment,
  Divider,
  IconButton,
  Checkbox,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import theme from "@/theme.config";
import { useDict } from "@/contexts/DictContext";
import TokenWithChainIcon from "@/components/TokenWithChainIcon";
import { useAccount, useBalance, useConfig } from "wagmi";
import Layout from "@/components/Layout";
import { CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP, CHAIN_ID_TO_ICON_MAP, CHAIN_ID_TO_USDTX_ADDRESS_MAP, ethereum, joc } from "@/wagmi.config";
import {
  switchChain,
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { useSnackbar } from "notistack";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { Chain, formatUnits, parseUnits } from "viem";
import { ethers } from "ethers";
import usdtxAbi from "@/libs/usdtx/abis/UsdtxAbi.json";
import { ellipsifyText } from "@/utils/string.utils";
import NetworkChangePopover from "@/components/NetworkChangePopover";
import TokenChangePopover, { Token } from "@/components/TokenChangePopover";

const sendTokens = [
  {
    name: 'USDTX',
    icon: '/icons/usdtx-icon.svg',
  },
  // {
  //   name: 'USDCX',
  //   icon: '/icons/usdcx-icon.svg',
  // },
]

export default function Send() {
  const dict = useDict();
  const [sendAmount, setSendAmount] = useState("");
  const resetSendAmount = useCallback(() => setSendAmount(""), []);
  const { classes } = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isSending, setIsSending] = useState(false);
  const wagmiConfig = useConfig();
  const { address, isConnected } = useAccount();
  const [selectedFromNetwork, setSelectedFromNetwork] = useState<Chain>(ethereum);
  const [selectedToNetwork, setSelectedToNetwork] = useState<Chain>(joc);
  const [selectedToken, setSelectedToken] = useState<Token>(sendTokens[0]);
  const [receiveAddress, setReceiveAddress] = useState("");
  const [fromNetworkChangePopoverAnchorEl, setFromNetworkChangePopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [toNetworkChangePopoverAnchorEl, setToNetworkChangePopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [tokenChangePopoverAnchorEl, setTokenChangePopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [isSendToAnotherWallet, setIsSendToAnotherWallet] = useState(false);
  const { data: fromTokenData, refetch: refetchFromTokenBalance } = useBalance({
    address,
    token: CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedFromNetwork.id] as any,
    chainId: selectedFromNetwork.id,
  });

  const fromTokenBalance = fromTokenData?.formatted;
  const insufficientBalance = sendAmount
    ? Number(sendAmount) >
      Number(fromTokenBalance)
    : false;

  const handleSendAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const amount = event.target.value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${6}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal
      setSendAmount(amount);
    },
    []
  );

  const swapFromAndToNetwork = useCallback(() => {
    const tempSelectedFromNetwork = selectedFromNetwork;
    setSelectedFromNetwork(selectedToNetwork);
    setSelectedToNetwork(tempSelectedFromNetwork);
  }, [setSelectedFromNetwork, setSelectedToNetwork, selectedFromNetwork, selectedToNetwork]);

  const handleSetMaxAmount = useCallback(() => {
    if (fromTokenBalance) {
      setSendAmount(fromTokenBalance);
    }
  }, [fromTokenBalance]);

  const handleSetHalfAmount = useCallback(() => {
    if (fromTokenBalance) {
      // Set half of the balance and format it to the token decimal
      const halfAmount = (parseUnits(fromTokenBalance, 6) / BigInt(2));
      setSendAmount(formatUnits(halfAmount, 6));
    }
  }, [fromTokenBalance]);

  const handleSubmit = useCallback(
    async (event: any) => {
      if (!address) {
        return;
      }

      const receiverAddress = isSendToAnotherWallet ? receiveAddress : address;

      event.preventDefault();
      setIsSending(true);

      try {
        await switchChain(wagmiConfig, { chainId: selectedFromNetwork.id });

        const isFromETH = selectedFromNetwork.id === ethereum.id;

        const options = isFromETH
          ? Options.newOptions()
              .addExecutorLzReceiveOption(200000, 0)
              .toHex()
              .toString()
          : Options.newOptions()
              .addExecutorLzReceiveOption(200000, 0)
              .addExecutorComposeOption(0, 500000, 0)
              .toHex()
              .toString();
        const sourceUsdtxAddress = CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedFromNetwork.id] as any;
        const composeMessage = isFromETH
          ? "0x"
          : ethers.solidityPacked(
              ["uint16", "bytes32"],
              [1, ethers.zeroPadValue(receiverAddress, 32)]
            );

        const destChain = CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[selectedToNetwork.id];

        const sendParam = [
          destChain,
          ethers.zeroPadValue(receiverAddress, 32),
          parseUnits(sendAmount, 6),
          parseUnits(sendAmount, 6),
          options,
          composeMessage,
          "0x",
        ];

        const fee: any = await readContract(wagmiConfig, {
          abi: usdtxAbi,
          address: sourceUsdtxAddress,
          functionName: "quoteSend",
          args: [sendParam, false],
        });

        const sendUsdtxTxHash = await writeContract(wagmiConfig, {
          abi: usdtxAbi,
          address: sourceUsdtxAddress,
          functionName: "send",
          args: [sendParam, [fee.nativeFee, 0], address],
          value: fee.nativeFee,
        });
        await waitForTransactionReceipt(wagmiConfig, {
          hash: sendUsdtxTxHash,
        });

        resetSendAmount();
        refetchFromTokenBalance();
        enqueueSnackbar(
          "Send USDTX successfully. Please wait a moment before the token is sent to the destination network.",
          { variant: "success" }
        );
      } catch (error) {
        console.log("Send USDTX failded with error: ", error);
        enqueueSnackbar("Send USDTX failed.", { variant: "error" });
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
    ]
  );

  const onOpenFromNetworkChangePopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setFromNetworkChangePopoverAnchorEl(event.currentTarget);
    },
    [setFromNetworkChangePopoverAnchorEl],
  );
  const onCloseFromNetworkChangePopover = useCallback(() => {
    setFromNetworkChangePopoverAnchorEl(null);
  }, [setFromNetworkChangePopoverAnchorEl]);

  const onOpenToNetworkChangePopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setToNetworkChangePopoverAnchorEl(event.currentTarget);
    },
    [setToNetworkChangePopoverAnchorEl],
  );
  const onCloseToNetworkChangePopover = useCallback(() => {
    setToNetworkChangePopoverAnchorEl(null);
  }, [setToNetworkChangePopoverAnchorEl]);

  const onOpenTokenChangePopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setTokenChangePopoverAnchorEl(event.currentTarget);
    },
    [setTokenChangePopoverAnchorEl],
  );
  const onCloseTokenChangePopover = useCallback(() => {
    setTokenChangePopoverAnchorEl(null);
  }, [setTokenChangePopoverAnchorEl]);

  const handleSendToAnotherWalletCheckboxChange = useCallback((event: SyntheticEvent<Element, Event>, checked: boolean) => {
    setIsSendToAnotherWallet(checked);
  }, []);

  const handleReceiveAddressChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiveAddress(event.target.value);
  }, []);

  const handleSelectFromNetwork = useCallback((network: Chain) => {
    setSelectedFromNetwork(network);
    resetSendAmount();
  }, [setSelectedFromNetwork, resetSendAmount]);

  const handleSelectToNetwork = useCallback((network: Chain) => {
    setSelectedToNetwork(network);
  }, [setSelectedToNetwork]);

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
                border="1px solid #E2E8F0"
                borderRadius="6px"
                padding="16px"
                paddingBottom={fromTokenBalance ? "16px" : "32px"}
              >
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="4px">
                  <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                    <Box className={classes.inputTitle}>
                      {dict.send_tab.from}
                    </Box>
                    <Box className={classes.addressTitle}>
                      {address && ellipsifyText(address, 6, 4)}
                    </Box>
                  </Box>
                  <Button
                    onClick={onOpenFromNetworkChangePopover}
                    className={classes.switchNetworkButton}
                  >
                    <Image src={CHAIN_ID_TO_ICON_MAP[selectedFromNetwork.id]} alt={selectedFromNetwork.name} width={16} height={16} />
                    <div className={classes.selectedNetworkTitle}>
                      {selectedFromNetwork.name}
                    </div>
                    <Image src="icons/arrow-down.svg" alt="USDT" width={16} height={16} />
                  </Button>
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
                              <Chip
                                onClick={handleSetHalfAmount}
                                label={"50%"}
                                className={classes.chipButton}
                              />
                            </div>
                            <div
                                className={classes.selectedTokenWrapper}
                                onClick={onOpenTokenChangePopover}
                              >
                                <TokenWithChainIcon
                                    tokenIcon={selectedToken.icon}
                                    chainIcon={CHAIN_ID_TO_ICON_MAP[selectedFromNetwork.id]}
                                    width={24}
                                    height={24}
                                  />
                                <Box color="black">
                                  {selectedToken.name}
                                </Box>
                                <Box padding="4px" display="flex" alignItems="center" justifyContent="center">
                                  <Image src="icons/caret-sort.svg" alt="USDT" width={16} height={16} />
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
                  {fromTokenBalance && <Box
                    display="flex"
                    alignItems="baseline"
                    justifyContent="start"
                    overflow="hidden"
                    maxWidth={theme.breakpoints.down("sm") ? 120 : "100%"}
                    gap={1}
                    width="100%"
                  >
                    <Box color="#64748B" fontSize={14}>{dict.mint_tab.balance}:</Box>
                    <Box color="#64748B">
                      {fromTokenBalance}
                    </Box>
                  </Box>
                  }
                </Box>
              </Box>
            </div>

            <IconButton
                onClick={swapFromAndToNetwork}
                sx={{
                  borderRadius: "6px",
                  backgroundColor: "#E2E8F0",
                  width: "40px",
                  height: "40px",
                  position: "absolute",
                  top: insufficientBalance ? "46%" : "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  "&:hover": {
                    backgroundColor: "#96A0B8",
                  },
                }}
            >
              <Image
                alt="Icon"
                src={"/icons/arrow-up-down.svg"}
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
                border="1px solid #E2E8F0"
                borderRadius="6px"
                padding="16px"
              >
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="4px">
                  <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                    <Box className={classes.inputTitle}>
                    {dict.send_tab.to}
                    </Box>
                    <Box className={classes.addressTitle}>
                      {address && ellipsifyText(address, 6, 4)}
                    </Box>
                  </Box>
                  <Button
                    onClick={onOpenToNetworkChangePopover}
                    className={classes.switchNetworkButton}
                  >
                    <Image src={CHAIN_ID_TO_ICON_MAP[selectedToNetwork.id]} alt={selectedToNetwork.name} width={16} height={16} />
                    <div className={classes.selectedNetworkTitle}>
                      {selectedToNetwork.name}
                    </div>
                    <Image src="icons/arrow-down.svg" alt="USDT" width={16} height={16} />
                  </Button>
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
                                border="1px solid #bdbdbd"
                                borderRadius={8}
                                display={"flex"}
                                alignItems={"center"}
                                padding={"8px 12px"}
                              >
                                <TokenWithChainIcon
                                    tokenIcon="/icons/usdtx-icon.svg"
                                    chainIcon={CHAIN_ID_TO_ICON_MAP[selectedToNetwork.id]}
                                    width={24}
                                    height={24}
                                  />
                                <Box marginLeft="4px" color="black">
                                  USDTX
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
              <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                <FormControlLabel
                  data-testid="agree-check-box-label"
                  control={<Checkbox data-testid="agree-check-box" />}
                  checked={isSendToAnotherWallet}
                  disabled={isSending}
                  label={
                    <Box className={classes.inputTitle}>
                      {dict.send_tab.another_wallet_address}
                    </Box>
                  }
                  onChange={handleSendToAnotherWalletCheckboxChange}
                />
              </Box>
              <TextField
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
              />
            </div>
          </div>
          <Button
            variant="contained"
            className={classes.sendButton}
            type="submit"
            color="primary"
            disabled={
              isSending ||
              !sendAmount ||
              insufficientBalance ||
              !isConnected ||
              (isSendToAnotherWallet && (!ethers.isAddress(receiveAddress) || receiveAddress === ""))
            }
            endIcon={
              isSending && <CircularProgress size={20} color="inherit" />
            }
          >
            {dict.send_tab.button}
          </Button>
        </div>
      </form>
      <NetworkChangePopover
        open={Boolean(fromNetworkChangePopoverAnchorEl)}
        onClose={onCloseFromNetworkChangePopover}
        onChangeNetwork={handleSelectFromNetwork}
        anchorEl={fromNetworkChangePopoverAnchorEl}
        selectedNetwork={selectedFromNetwork}
        networks={wagmiConfig.chains.filter((chain) => chain.id !== selectedToNetwork.id) as any}
      />
      <NetworkChangePopover
        open={Boolean(toNetworkChangePopoverAnchorEl)}
        onClose={onCloseToNetworkChangePopover}
        onChangeNetwork={handleSelectToNetwork}
        anchorEl={toNetworkChangePopoverAnchorEl}
        selectedNetwork={selectedToNetwork}
        networks={wagmiConfig.chains.filter((chain) => chain.id !== selectedFromNetwork.id) as any}
      />
      <TokenChangePopover
        open={Boolean(tokenChangePopoverAnchorEl)}
        onClose={onCloseTokenChangePopover}
        onChangeToken={(token: Token) => {setSelectedToken(token)}}
        anchorEl={tokenChangePopoverAnchorEl}
        selectedToken={selectedToken}
        currentNetwork={selectedFromNetwork.name}
        tokens={sendTokens}
      />
    </Layout>
  );
}

const useStyles = makeStyles()((theme: Theme) => ({
  wrapper: {
    width: "100%",
    padding: '32px',
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    boxShadow: "0px 1px 3px 0px #0000001A, 0px 1px 2px -1px #0000001A",
    border: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down("sm")]: {
      padding: '24px',
    },
  },
  infoWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    position: "relative",
  },
  itemWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "start",
  },
  sendButton: {
    textTransform: "none",
    padding: "12px",
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
      flexDirection: "column",
      alignItems: "end",
      gap: "4px",
    },
  },
  chipWrapper: {
    display: "flex",
    gap: "4px",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "24px",
    },
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
    fontSize: "16px",
    color: "#000000",
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
    [theme.breakpoints.down("sm")]: {
      maxWidth: "140px",
    },
  },
  selectedTokenWrapper: {
    border: "1px solid #bdbdbd",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    gap: "4px",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      padding: "8px 4px",
      gap: "2px",
    },
  },
}));
