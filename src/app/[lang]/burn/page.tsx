"use client";

import React, { useCallback, useState } from "react";
import {
  Button,
  TextField,
  Chip,
  CircularProgress,
  Box,
  alpha,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import { useDict } from "@/contexts/DictContext";
import { useSnackbar } from "notistack";
import TokenWithChainIcon from "@/components/TokenWithChainIcon";
import { useAccount, useBalance, useChainId, useConfig } from "wagmi";
import {
  switchChain,
  writeContract,
  waitForTransactionReceipt,
  readContract,
} from "wagmi/actions";
import { CHAIN_ID_TO_ICON_MAP, CHAIN_ID_TO_USDTX_ADDRESS_MAP, ethereum } from "@/wagmi.config";
import { Chain, formatUnits, parseUnits } from "viem";
import usdtxAbi from "@/libs/usdtx/abis/UsdtxAbi.json";
import Layout from "@/components/Layout";
import NetworkChangePopover from "@/components/NetworkChangePopover";
import TokenChangePopover, { Token } from "@/components/TokenChangePopover";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { ethers } from "ethers";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import Image from "next/image";

const burnToken = [
  {
    name: 'USDTX',
    icon: '/icons/usdtx-icon.svg',
  },
  // {
  //   name: 'USDCX',
  //   icon: '/icons/usdcx-icon.svg',
  // },
]

export default function Burn() {
  const dict = useDict();
  const wagmiConfig = useConfig();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [burnAmount, setBurnAmount] = useState("");
  const resetBurnAmount = useCallback(() => setBurnAmount(""), []);
  const [isBurning, setIsBurning] = useState(false);
  const { classes } = useStyles();
  const chainId = useChainId();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [selectedNetwork, setSelectedNetwork] = useState<Chain>(ethereum);
  const [selectedToken, setSelectedToken] = useState<Token>(burnToken[0]);
  const { data: currentTokenData, refetch: refetchCurrentTokenData } =
    useBalance({
      address,
      token: CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedNetwork.id] as any,
      chainId: selectedNetwork.id,
    });
  const [networkChangePopoverAnchorEl, setNetworkChangePopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [tokenChangePopoverAnchorEl, setTokenChangePopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);

  const currentTokenBalance = currentTokenData?.formatted;
  const insufficientBalance = burnAmount
    ? Number(burnAmount) > Number(currentTokenBalance)
    : false;

  const handleMintAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const amount = event.target.value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${6}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal
      setBurnAmount(amount);
    },
    []
  );

  const handleSetMaxAmount = useCallback(() => {
    if (currentTokenBalance) {
      setBurnAmount(currentTokenBalance);
    }
  }, [currentTokenBalance]);

  const handleSetHalfAmount = useCallback(() => {
    if (currentTokenBalance) {
      // Set half of the balance and format it to the token decimal
      const halfAmount = (parseUnits(currentTokenBalance, 6) / BigInt(2));
      setBurnAmount(formatUnits(halfAmount, 6));
    }
  }, [currentTokenBalance]);

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsBurning(true);
      try {
        if (chainId !== selectedNetwork.id) {
          await switchChain(wagmiConfig, { chainId: selectedNetwork.id });
        }

        const isFromETH = selectedNetwork.id === ethereum.id;

        if(!isFromETH && address) {
          const ethereumUsdtxAddress = CHAIN_ID_TO_USDTX_ADDRESS_MAP[ethereum.id] as any;
          const sourceUsdtxAddress = CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedNetwork.id] as any;

          const options = Options.newOptions()
            .addExecutorLzReceiveOption(200000, 0)
            .addExecutorComposeOption(0, 500000, 0)
            .toHex()
            .toString();

          const composeMessage = ethers.solidityPacked(
            ["uint16", "bytes32"],
            [1, ethers.zeroPadValue(address, 32)]
          );

          const sendParam = [
            EndpointId.SEPOLIA_V2_TESTNET,
            ethers.zeroPadValue(ethereumUsdtxAddress, 32),
            ethers.parseUnits(burnAmount, 6),
            ethers.parseUnits(burnAmount, 6),
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
        } else {
          const hash = await writeContract(wagmiConfig, {
            abi: usdtxAbi,
            address: CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedNetwork.id] as any,
            functionName: "burn",
            args: [parseUnits(burnAmount, 6)],
          });

          await waitForTransactionReceipt(wagmiConfig, {
            hash,
          });
        }

        resetBurnAmount();
        refetchCurrentTokenData();
        enqueueSnackbar(dict.burn_tab.burn_success, { variant: "success" });
      } catch (error) {
        console.log("Burn failded with error: ", error);
        enqueueSnackbar("Burn failed.", { variant: "error" });
      } finally {
        setIsBurning(false);
      }
    },
    [
      burnAmount,
      chainId,
      dict.burn_tab.burn_success,
      enqueueSnackbar,
      selectedNetwork,
      refetchCurrentTokenData,
      resetBurnAmount,
      wagmiConfig,
      address,
    ]
  );

  const onOpenNetworkChangePopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setNetworkChangePopoverAnchorEl(event.currentTarget);
    },
    [setNetworkChangePopoverAnchorEl],
  );
  const onCloseNetworkChangePopover = useCallback(() => {
    setNetworkChangePopoverAnchorEl(null);
  }, [setNetworkChangePopoverAnchorEl]);

  const onOpenTokenChangePopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setTokenChangePopoverAnchorEl(event.currentTarget);
    },
    [setTokenChangePopoverAnchorEl],
  );
  const onCloseTokenChangePopover = useCallback(() => {
    setTokenChangePopoverAnchorEl(null);
  }, [setTokenChangePopoverAnchorEl]);

  const theme = useTheme();

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
                paddingBottom={currentTokenBalance ? "16px" : "32px"}
              >
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="4px">
                  <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                    <Box className={classes.inputTitle}>
                      {dict.burn_tab.burn}
                    </Box>
                  </Box>
                  <Button
                    onClick={onOpenNetworkChangePopover}
                    className={classes.switchNetworkButton}
                  >
                    <Image src={CHAIN_ID_TO_ICON_MAP[selectedNetwork.id]} alt={selectedNetwork.name} width={16} height={16} />
                    <div className={classes.selectedNetworkTitle}>
                      {selectedNetwork.name}
                    </div>
                    <Image src="icons/arrow-down.svg" alt="USDT" width={16} height={16} />
                  </Button>
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
                              <Chip
                                onClick={handleSetHalfAmount}
                                label={"50%"}
                                className={classes.chipButton}
                              />
                            </div>
                            <div className={classes.balanceWrapper}>
                              <div
                                  className={classes.selectedTokenWrapper}
                                  onClick={onOpenTokenChangePopover}
                                >
                                  <TokenWithChainIcon
                                    tokenIcon={selectedToken.icon}
                                    chainIcon={CHAIN_ID_TO_ICON_MAP[selectedNetwork.id]}
                                    width={24}
                                    height={24}
                                  />
                                  <Box marginLeft="4px" color="black">
                                    {selectedToken.name}
                                  </Box>
                                  <Box padding="4px" display="flex" alignItems="center" justifyContent="center">
                                    <Image src="icons/caret-sort.svg" alt="USDT" width={16} height={16} />
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
                  {currentTokenBalance && <Box
                    display="flex"
                    alignItems="baseline"
                    justifyContent="start"
                    overflow="hidden"
                    maxWidth={theme.breakpoints.down("sm") ? 120 : "100%"}
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    gap={1}
                    width="100%"
                  >
                    <Box color="#64748B" fontSize={14}>{dict.mint_tab.balance}:</Box>
                    <Box color="#64748B"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap">
                      {currentTokenBalance}
                    </Box>
                  </Box>
                  }
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
                border="1px solid #E2E8F0"
                borderRadius="6px"
                padding="16px"
                sx={{ backgroundColor: "#E2E8F0" }}
              >
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="4px">
                  <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                    <Box className={classes.inputTitle}>
                      {dict.burn_tab.out}
                    </Box>
                  </Box>
                  <div
                    className={classes.madeNetworkWrapper}
                  >
                    <Image src={CHAIN_ID_TO_ICON_MAP[ethereum.id]} alt={selectedNetwork.name} width={16} height={16} />
                    <div className={classes.selectedNetworkTitle}>
                      {ethereum.name}
                    </div>
                  </div>
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
                              >
                                <TokenWithChainIcon
                                  tokenIcon="/icons/usdt.svg"
                                  chainIcon="/icons/ethereum.svg"
                                  width={24}
                                  height={24}
                                />
                                <Box marginLeft="4px" color="black">
                                  USDT
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
              className={classes.sendButton}
              type="submit"
              color="primary"
              disabled={
                isBurning ||
                !burnAmount ||
                insufficientBalance ||
                isDisconnected ||
                isConnecting
              }
              endIcon={
                isBurning && <CircularProgress size={20} color="inherit" />
              }
            >
              {dict.burn_tab.button}
          </Button>
        </div>
      </form>
      <NetworkChangePopover
        open={Boolean(networkChangePopoverAnchorEl)}
        onClose={onCloseNetworkChangePopover}
        onChangeNetwork={(network: Chain) => {setSelectedNetwork(network)}}
        anchorEl={networkChangePopoverAnchorEl}
        selectedNetwork={selectedNetwork}
        networks={wagmiConfig.chains as any}
      />
      <TokenChangePopover
        open={Boolean(tokenChangePopoverAnchorEl)}
        onClose={onCloseTokenChangePopover}
        onChangeToken={(token: Token) => {setSelectedToken(token)}}
        anchorEl={tokenChangePopoverAnchorEl}
        selectedToken={selectedToken}
        currentNetwork={selectedNetwork.name}
        tokens={burnToken}
      />
    </Layout>
  );
}

const useStyles = makeStyles()((theme: Theme) => ({
  wrapper: {
    width: "100%",
    padding: "32px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    backgroundColor: "white",
    boxShadow:
      "0px 1px 2px -1px rgba(0, 0, 0, 0.10), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)",
    border: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down("sm")]: {
      padding: "24px",
    },
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
    fontSize: "16px",
    color: "#000000",
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
