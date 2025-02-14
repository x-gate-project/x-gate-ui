"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  writeContract,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { ethereum } from "@/wagmi.config";
import { parseUnits } from "viem";
import UsdtxAbi from "@/libs/usdtx/abis/UsdtxAbi.json";
import Layout from "@/components/Layout";

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
  const { data: usdtxEthereumData, refetch: refetchUsdtEthereumData } =
    useBalance({
      address,
      token: process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS as any,
      chainId: ethereum.id,
    });

  const usdtxEthereumBalance = usdtxEthereumData?.formatted;
  const insufficientBalance = burnAmount
    ? Number(burnAmount) > Number(usdtxEthereumBalance)
    : false;

  const handleMintAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const amount = event.target.value.replace(/\D/g, ""); // Replace all non-digit characters with empty string
      setBurnAmount(amount);
    },
    []
  );

  const handleSetMaxAmount = useCallback(() => {
    if (usdtxEthereumBalance) {
      setBurnAmount(usdtxEthereumBalance);
    }
  }, [usdtxEthereumBalance]);

  const handleSetHalfAmount = useCallback(() => {
    if (usdtxEthereumBalance) {
      // Set half of the balance
      const halfAmount = Math.floor(Number(usdtxEthereumBalance) / 2);
      setBurnAmount(halfAmount.toString());
    }
  }, [usdtxEthereumBalance]);

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      setIsBurning(true);
      try {
        if (chainId !== ethereum.id) {
          await switchChain(wagmiConfig, { chainId: ethereum.id });
        }

        const hash = await writeContract(wagmiConfig, {
          abi: UsdtxAbi,
          address: process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS as any,
          functionName: "burn",
          args: [parseUnits(burnAmount, 6)],
        });

        await waitForTransactionReceipt(wagmiConfig, {
          hash,
        });

        resetBurnAmount();
        refetchUsdtEthereumData();
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
      refetchUsdtEthereumData,
      resetBurnAmount,
      wagmiConfig,
    ]
  );

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className={classes.wrapper}>
          <div className={classes.itemWrapper}>
            <Box fontSize={16} color="#000000">
              {dict.burn_tab.burn}
            </Box>
            <TextField
              fullWidth
              placeholder="0"
              variant="outlined"
              // name="amountSSS"
              InputProps={{
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
                        <Box
                          border="1px solid #bdbdbd"
                          borderRadius={8}
                          display={"flex"}
                          alignItems={"center"}
                          padding={"8px 12px"}
                        >
                          <TokenWithChainIcon
                            tokenIcon="/icons/usdtx.svg"
                            chainIcon="/icons/ethereum.svg"
                            width={24}
                            height={24}
                          />
                          <Box marginLeft="4px" color="black">
                            USDTX
                          </Box>
                        </Box>
                        {usdtxEthereumBalance && (
                          <Box
                            display="flex"
                            alignItems="baseline"
                            overflow="hidden"
                            maxWidth={120}
                            gap={1}
                          >
                            <Box fontSize={14}>{dict.burn_tab.balance}:</Box>
                            <Box>{usdtxEthereumBalance}</Box>
                          </Box>
                        )}
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
              value={burnAmount}
              onChange={handleMintAmountChange}
              inputProps={{ "data-testid": "amount-input" }}
              error={insufficientBalance}
              helperText={insufficientBalance && dict.burn_tab.invalid_amount}
            />
          </div>
          <div className={classes.itemWrapper}>
            <Box fontSize={16} color="#000000">
              {dict.burn_tab.out}
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
              value={burnAmount}
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
    backgroundColor: "white",
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
    // color: theme.palette.text.secondary,
    maxLines: 1,
  },
  balanceContent: {
    fontSize: "14px",
    color: theme.palette.text.secondary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxLines: 1,
  },
}));
