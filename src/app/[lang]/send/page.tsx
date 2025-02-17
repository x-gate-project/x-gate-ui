"use client";

import React, { useCallback, useState } from "react";
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
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import theme from "@/theme.config";
import { useDict } from "@/contexts/DictContext";
import TokenWithChainIcon from "@/components/TokenWithChainIcon";
import { useAccount, useBalance, useChainId, useConfig } from "wagmi";
import Layout from "@/components/Layout";
import { joc, ethereum } from "@/wagmi.config";
import {
  switchChain,
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { useSnackbar } from "notistack";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { formatUnits, parseUnits } from "viem";
import { ethers } from "ethers";
import usdtxAbi from "@/libs/usdtx/abis/UsdtxAbi.json";
import { isProduction } from "@/utils/system";

export default function Send() {
  const dict = useDict();
  const [sendAmount, setSendAmount] = useState("");
  const resetSendAmount = useCallback(() => setSendAmount(""), []);
  const { classes } = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isSending, setIsSending] = useState(false);
  const [isFromETH, setIsFromETH] = useState(false);
  const wagmiConfig = useConfig();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: usdtxEthereumData, refetch: refetchUsdtxEthereumBalance } =
    useBalance({
      address,
      token: process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS as any,
      chainId: ethereum.id,
    });
  const usdtxEthereumBalance = usdtxEthereumData?.formatted;

  const { data: usdtxJocData, refetch: refetchUsdtxJocBalance } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_USDTX_JOC_ADDRESS as any,
    chainId: joc.id,
  });
  const usdtxJocBalance = usdtxJocData?.formatted;

  const insufficientBalance = sendAmount
    ? Number(sendAmount) >
      (isFromETH ? Number(usdtxEthereumBalance) : Number(usdtxJocBalance))
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
    setIsFromETH(!isFromETH);
  }, [setIsFromETH, isFromETH]);

  const handleSetMaxAmount = useCallback(() => {
    if (usdtxEthereumBalance && usdtxJocBalance) {
      setSendAmount(isFromETH ? usdtxEthereumBalance : usdtxJocBalance);
    }
  }, [isFromETH, usdtxEthereumBalance, usdtxJocBalance]);

  const handleSetHalfAmount = useCallback(() => {
    if (usdtxEthereumBalance && usdtxJocBalance) {
      // Set half of the balance and format it to the token decimal
      const halfAmount = (parseUnits(isFromETH ? usdtxEthereumBalance : usdtxJocBalance, 6) / BigInt(2));
      setSendAmount(formatUnits(halfAmount, 6));
    }
  }, [isFromETH, usdtxEthereumBalance, usdtxJocBalance]);

  const handleSubmit = useCallback(
    async (event: any) => {
      if (!address) {
        return;
      }

      event.preventDefault();
      setIsSending(true);

      try {
        if (isFromETH && chainId !== ethereum.id) {
          await switchChain(wagmiConfig, { chainId: ethereum.id });
        }

        if (!isFromETH && chainId !== joc.id) {
          await switchChain(wagmiConfig, { chainId: joc.id });
        }

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
        const sourceUsdtxAddress: any = isFromETH
          ? process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS
          : process.env.NEXT_PUBLIC_USDTX_JOC_ADDRESS;
        const composeMessage = isFromETH
          ? "0x"
          : ethers.solidityPacked(
              ["uint16", "bytes32"],
              [1, ethers.zeroPadValue(address, 32)]
            );
        const destChain = isFromETH
          ? isProduction
            ? EndpointId.JOC_V2_MAINNET
            : EndpointId.JOC_V2_TESTNET
          : isProduction
          ? EndpointId.ETHEREUM_V2_MAINNET
          : EndpointId.SEPOLIA_V2_TESTNET;

        const sendParam = [
          destChain,
          ethers.zeroPadValue(address, 32),
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
        refetchUsdtxEthereumBalance();
        refetchUsdtxJocBalance();
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
      chainId,
      enqueueSnackbar,
      isFromETH,
      refetchUsdtxEthereumBalance,
      refetchUsdtxJocBalance,
      resetSendAmount,
      sendAmount,
      wagmiConfig,
    ]
  );

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className={classes.wrapper}>
          <div className={classes.itemWrapper}>
            <Box fontSize={16} color="#000000">
              {dict.send_tab.from}
            </Box>
            <TextField
              fullWidth
              placeholder="0"
              variant="outlined"
              value={sendAmount}
              onChange={handleSendAmountChange}
              InputProps={{
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
                      <div className={classes.balanceWrapper}>
                        <Box
                          border="1px solid #bdbdbd"
                          borderRadius={8}
                          display={"flex"}
                          alignItems={"center"}
                          padding={"8px 12px"}
                        >
                          {isFromETH ? (
                            <TokenWithChainIcon
                              tokenIcon="/icons/usdtx.svg"
                              chainIcon="/icons/ethereum.svg"
                              width={24}
                              height={24}
                            />
                          ) : (
                            <TokenWithChainIcon
                              tokenIcon="/icons/usdtx.svg"
                              chainIcon="/icons/japan-open-chain.svg"
                              width={24}
                              height={24}
                            />
                          )}
                          <Box marginLeft="4px" color="black">
                            USDTX
                          </Box>
                        </Box>
                        {usdtxEthereumBalance && usdtxJocBalance && <Box
                          display="flex"
                          alignItems="baseline"
                          overflow="hidden"
                          maxWidth={120}
                          gap={1}
                        >
                          <Box fontSize={14}>{dict.mint_tab.balance}:</Box>
                          <Box>
                            {isFromETH ? usdtxEthereumBalance : usdtxJocBalance}
                          </Box>
                        </Box>}
                      </div>
                    </div>
                  </InputAdornment>
                ),
              }}
              className={classes.textField}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "32px",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              autoFocus
              size="medium"
              name="from"
              inputProps={{ "data-testid": "from-input" }}
              error={insufficientBalance}
              helperText={insufficientBalance && dict.send_tab.invalid_amount}
            />
          </div>

          <div className={classes.dividerWrapper}>
            <Divider className={classes.divider}></Divider>
            <IconButton
              onClick={swapFromAndToNetwork}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "4px",
                width: "40px",
                height: "40px",
              }}
            >
              <Image
                alt="Icon"
                src={"/icons/arrow-up-down.svg"}
                width={16}
                height={16}
              />
            </IconButton>
            <Divider className={classes.divider}></Divider>
          </div>

          <div className={classes.itemWrapper}>
            <Box fontSize={16} color="#000000">
              {dict.send_tab.to}
            </Box>
            <TextField
              fullWidth
              placeholder="0"
              variant="outlined"
              disabled
              InputProps={{
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
                          {isFromETH ? (
                            <TokenWithChainIcon
                              tokenIcon="/icons/usdtx.svg"
                              chainIcon="/icons/japan-open-chain.svg"
                              width={24}
                              height={24}
                            />
                          ) : (
                            <TokenWithChainIcon
                              tokenIcon="/icons/usdtx.svg"
                              chainIcon="/icons/ethereum.svg"
                              width={24}
                              height={24}
                            />
                          )}
                          <Box marginLeft="4px" color="black">
                            USDTX
                          </Box>
                        </Box>
                      </div>
                    </div>
                  </InputAdornment>
                ),
              }}
              className={classes.textField}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
                "& .MuiInputBase-input": {
                  paddingLeft: "32px",
                },
              }}
              size="medium"
              value={sendAmount}
              name="to"
              inputProps={{ "data-testid": "to-input" }}
            />
          </div>
          <Button
            variant="contained"
            className={classes.sendButton}
            type="submit"
            color="primary"
            disabled={
              isSending || !sendAmount || insufficientBalance || !isConnected
            }
            endIcon={
              isSending && <CircularProgress size={20} color="inherit" />
            }
          >
            {dict.send_tab.button}
          </Button>
        </div>
      </form>
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
    gap: "16px",
    boxShadow:
      "0px 1px 2px -1px rgba(0, 0, 0, 0.10), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)",
    border: `1px solid ${theme.palette.divider}`,
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
}));
