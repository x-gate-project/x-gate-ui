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
import { useAccount, useBalance, useChainId, useConfig } from "wagmi";
import {
  switchChain,
  writeContract,
  waitForTransactionReceipt,
  readContract,
} from "wagmi/actions";
import { CHAIN_ID_TO_ICON_MAP, CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP, CHAIN_ID_TO_USDCX_ADDRESS_MAP, CHAIN_ID_TO_USDTX_ADDRESS_MAP, ethereum } from "@/wagmi.config";
import { Chain, formatUnits, parseUnits } from "viem";
import tokenContractAbi from "@/libs/usdtx/abis/UsdtxAbi.json";
import Layout from "@/components/Layout";
import NetworkChangePopover from "@/components/NetworkChangePopover";
import TokenChangePopover from "@/components/TokenChangePopover";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { ethers } from "ethers";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import Image from "next/image";
import { Token } from "@/enums/token";
import { TOKEN_TO_ICON_MAP } from "@/utils/token.utils";
import { waitForMessageReceived } from "@layerzerolabs/scan-client";
import localStorageService from "@/services/local-storage.service";
import { usePageState } from "@/contexts/PageStateContext";

const BURN_SUPPORT_TOKENS = [
  Token.USDTX,
  Token.USDCX,
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
  const { pageState, setPageState } = usePageState();
  const selectedToken = useMemo(() => pageState.burn.token as Token, [pageState]);
  const selectedNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === (pageState.burn.fromChainId)) || ethereum, [pageState, wagmiConfig]);
  const { data: currentTokenData, refetch: refetchCurrentTokenData } =
    useBalance({
      address,
      token: selectedToken === Token.USDTX ? CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedNetwork.id] as any : CHAIN_ID_TO_USDCX_ADDRESS_MAP[selectedNetwork.id] as any,
      chainId: selectedNetwork.id,
    });
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
          const ethereumTokenAddress = selectedToken === Token.USDTX ? CHAIN_ID_TO_USDTX_ADDRESS_MAP[ethereum.id] as any : CHAIN_ID_TO_USDCX_ADDRESS_MAP[ethereum.id] as any;
          const sourceTokenAddress = selectedToken === Token.USDTX ? CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedNetwork.id] as any : CHAIN_ID_TO_USDCX_ADDRESS_MAP[selectedNetwork.id] as any;

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
            ethers.zeroPadValue(ethereumTokenAddress, 32),
            ethers.parseUnits(burnAmount, 6),
            ethers.parseUnits(burnAmount, 6),
            options,
            composeMessage,
            "0x",
          ];

          const fee: any = await readContract(wagmiConfig, {
            abi: tokenContractAbi,
            address: sourceTokenAddress,
            functionName: "quoteSend",
            args: [sendParam, false],
          });

          const sendTokenTxHash = await writeContract(wagmiConfig, {
            abi: tokenContractAbi,
            address: sourceTokenAddress,
            functionName: "send",
            args: [sendParam, [fee.nativeFee, 0], address],
            value: fee.nativeFee,
          });
          await waitForTransactionReceipt(wagmiConfig, {
            hash: sendTokenTxHash,
          });
          enqueueSnackbar(
            dict.burn_tab.waiting_for_sending.replace("{{token}}", selectedToken).replace("{{destination}}", ethereum.name),
            { variant: "info" }
          );

          await waitForMessageReceived(CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP[selectedNetwork.id], sendTokenTxHash);
        } else {
          const hash = await writeContract(wagmiConfig, {
            abi: tokenContractAbi,
            address: selectedToken === Token.USDTX ? CHAIN_ID_TO_USDTX_ADDRESS_MAP[selectedNetwork.id] as any : CHAIN_ID_TO_USDCX_ADDRESS_MAP[selectedNetwork.id] as any,
            functionName: "burn",
            args: [parseUnits(burnAmount, 6)],
          });

          await waitForTransactionReceipt(wagmiConfig, {
            hash,
          });
        }

        resetBurnAmount();
        refetchCurrentTokenData();
        enqueueSnackbar(
          dict.burn_tab.burn_success.replace("{{token}}", selectedToken),
          { variant: "success" }
        );
      } catch (error) {
        console.log("Burn failded with error: ", error);
        enqueueSnackbar(
          dict.burn_tab.burn_failed.replace("{{token}}", selectedToken),
          { variant: "error" }
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
      selectedNetwork,
      refetchCurrentTokenData,
      resetBurnAmount,
      wagmiConfig,
      address,
      selectedToken,
    ]
  );

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

  const handleSelectToken = useCallback((token: Token) => {
    const pageState = localStorageService.setPageState({
      burnToken: token,
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
                                  onClick={onOpenTokenChangePopover}
                                >
                                  <TokenWithChainIcon
                                    tokenIcon={TOKEN_TO_ICON_MAP[selectedToken]}
                                    chainIcon={CHAIN_ID_TO_ICON_MAP[selectedNetwork.id]}
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
                  {currentTokenBalance &&
                  <Tooltip title={currentTokenBalance}>
                    <Box
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
                  </Tooltip>
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
                                  tokenIcon={TOKEN_TO_ICON_MAP[selectedToken]}
                                  chainIcon="/icons/ethereum.svg"
                                  width={24}
                                  height={24}
                                />
                                <Box paddingLeft="2px" color="black">
                                  {selectedToken === Token.USDTX ? Token.USDT : Token.USDC}
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
      <TokenChangePopover
        open={Boolean(tokenChangePopoverAnchorEl)}
        onClose={onCloseTokenChangePopover}
        onChangeToken={handleSelectToken}
        anchorEl={tokenChangePopoverAnchorEl}
        selectedToken={selectedToken}
        networks={[selectedNetwork]}
        tokens={BURN_SUPPORT_TOKENS}
      />
    </Layout>
  );
}

const useStyles = makeStyles()((theme: Theme) => ({
  wrapper: {
    width: "100%",
    padding: "32px",
    borderRadius: "28px",
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
    padding: "14px 12px",
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
}));
