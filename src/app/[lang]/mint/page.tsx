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
} from "wagmi/actions";
import { CHAIN_ID_TO_ICON_MAP, ethereum } from "@/wagmi.config";
import { Chain, formatUnits, parseUnits } from "viem";
import usdtxAbi from "@/libs/usdtx/abis/UsdtxAbi.json";
import erc20Abi from "@/libs/usdtx/abis/Erc20Abi.json";
import Layout from "@/components/Layout";
import NetworkChangePopover from "@/components/NetworkChangePopover";
import TokenChangePopover, { Token } from "@/components/TokenChangePopover";

const mintTokens = [
  {
    name: 'USDT',
    icon: '/icons/usdt.svg',
  },
]

export default function Mint() {
  const dict = useDict();
  const wagmiConfig = useConfig();
  const { enqueueSnackbar } = useSnackbar();
  const [mintAmount, setMintAmount] = useState("");
  const resetMintAmount = useCallback(() => setMintAmount(""), []);
  const { classes } = useStyles();
  const [isMinting, setIsMinting] = useState(false);
  const chainId = useChainId();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [selectedNetwork, setSelectedNetwork] = useState<Chain>(ethereum);
  const [selectedToken, setSelectedToken] = useState<Token>(mintTokens[0]);
  const [networkChangePopoverAnchorEl, setNetworkChangePopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [tokenChangePopoverAnchorEl, setTokenChangePopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const { data: usdtEthereumData, refetch: refetchUsdtEthereumData } =
    useBalance({
      address,
      token: process.env.NEXT_PUBLIC_USDT_ETHEREUM_ADDRESS as any,
      chainId: selectedNetwork.id,
    });
  const usdtEthereumBalance = usdtEthereumData?.formatted;
  const insufficientBalance = mintAmount
    ? Number(mintAmount) > Number(usdtEthereumBalance)
    : false;

  const handleMintAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const amount = event.target.value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${6}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal
      setMintAmount(amount);
    },
    []
  );

  const handleSetMaxAmount = useCallback(() => {
    if (usdtEthereumBalance) {
      setMintAmount(usdtEthereumBalance);
    }
  }, [usdtEthereumBalance]);

  const handleSetHalfAmount = useCallback(() => {
    if (usdtEthereumBalance) {
      // Set half of the balance and format it to the token decimal
      const halfAmount = (parseUnits(usdtEthereumBalance, 6) / BigInt(2));
      setMintAmount(formatUnits(halfAmount, 6));
    }
  }, [usdtEthereumBalance]);

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsMinting(true);

      try {
        if (chainId !== ethereum.id) {
          await switchChain(wagmiConfig, { chainId: ethereum.id });
        }

        const approveUsdtxTxHash = await writeContract(wagmiConfig, {
          abi: erc20Abi,
          address: process.env.NEXT_PUBLIC_USDT_ETHEREUM_ADDRESS as any,
          functionName: "approve",
          args: [
            process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS as any,
            parseUnits(mintAmount, 6),
          ],
        });
        await waitForTransactionReceipt(wagmiConfig, {
          hash: approveUsdtxTxHash,
        });
        console.log("Approved USDTX successfully. Minting USDTX...");

        const mintUsdtxTxHash = await writeContract(wagmiConfig, {
          abi: usdtxAbi,
          address: process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS as any,
          functionName: "mint",
          args: [parseUnits(mintAmount, 6)],
        });
        await waitForTransactionReceipt(wagmiConfig, {
          hash: mintUsdtxTxHash,
        });
        console.log("Mint USDTX successfully.");

        resetMintAmount();
        refetchUsdtEthereumData();
        enqueueSnackbar(dict.burn_tab.burn_success, { variant: "success" });
      } catch (error) {
        console.log("Mint USDTX failded with error: ", error);
        enqueueSnackbar("Mint USDTX failed.", { variant: "error" });
      } finally {
        setIsMinting(false);
      }
    },
    [
      chainId,
      dict.burn_tab.burn_success,
      enqueueSnackbar,
      mintAmount,
      refetchUsdtEthereumData,
      resetMintAmount,
      wagmiConfig,
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
                paddingBottom={usdtEthereumBalance ? "16px" : "32px"}
              >
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="4px">
                  <Box display="flex" alignItems="center" justifyContent="center" gap="4px">
                    <Box className={classes.inputTitle}>
                    {dict.mint_tab.mint}
                    </Box>
                  </Box>
                  <Button
                    onClick={onOpenNetworkChangePopover}
                    className={classes.switchNetworkButton}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={CHAIN_ID_TO_ICON_MAP[selectedNetwork.id]} alt={selectedNetwork.name} width={16} height={16} />
                    <div className={classes.selectedNetworkTitle}>
                      {selectedNetwork.name}
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="icons/arrow-down.svg" alt="USDT" width="16" />
                  </Button>
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
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src="icons/caret-sort.svg" alt="USDT" width="16"/>
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
                  {usdtEthereumBalance && <Box
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
                      {usdtEthereumBalance}
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
                      {dict.mint_tab.made}
                    </Box>
                  </Box>
                  <div
                    className={classes.madeNetworkWrapper}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={CHAIN_ID_TO_ICON_MAP[ethereum.id]} alt={selectedNetwork.name} width="16" />
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
                                sx={{backgroundColor: "white"}}
                                borderRadius={8}
                                display={"flex"}
                                alignItems={"center"}
                                padding={"8px 12px"}
                              >
                                <TokenWithChainIcon
                                  tokenIcon="/icons/usdtx-icon.svg"
                                  chainIcon="/icons/ethereum.svg"
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
              className={classes.sendButton}
              type="submit"
              color="primary"
              disabled={
                isMinting ||
                !mintAmount ||
                insufficientBalance ||
                isDisconnected ||
                isConnecting
              }
              endIcon={
                isMinting && <CircularProgress size={20} color="inherit" />
              }
            >
              {dict.mint_tab.button}
            </Button>
        </div>
      </form>
      <NetworkChangePopover
        open={Boolean(networkChangePopoverAnchorEl)}
        onClose={onCloseNetworkChangePopover}
        onChangeNetwork={(network: Chain) => {setSelectedNetwork(network)}}
        anchorEl={networkChangePopoverAnchorEl}
        selectedNetwork={selectedNetwork}
        networks={wagmiConfig.chains.filter((chain) => chain.id === ethereum.id)}
      />
      <TokenChangePopover
        open={Boolean(tokenChangePopoverAnchorEl)}
        onClose={onCloseTokenChangePopover}
        onChangeToken={(token: Token) => {setSelectedToken(token)}}
        anchorEl={tokenChangePopoverAnchorEl}
        selectedToken={selectedToken}
        currentNetwork={selectedNetwork.name}
        tokens={mintTokens}
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
      alignItems: "center",
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
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "160px",
    },
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
