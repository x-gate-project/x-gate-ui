"use client";

import React, { useCallback, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useDict } from "@/contexts/DictContext";
import { useTransactionState } from "@/contexts/TransactionStateContext";
import CircularProgress from "@mui/material/CircularProgress";
import RecentTransactionDialog from "@/components/RecentTransactionDialog";
import { useAccount } from "wagmi";
import SwapVerticalCircleRoundedIcon from '@mui/icons-material/SwapVerticalCircleRounded';
import theme from "@/theme.config";

export default function TransactionButton() {
  const dict = useDict();
  const { transactions } = useTransactionState();
  const pendingTransactions = useMemo(() => transactions.filter((tx) => tx.confirmedAt === undefined && tx.isFailed === undefined), [transactions]);
  const { isConnected } = useAccount();

  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const onOpenTransactionDialog = useCallback(() => {
    setOpenTransactionDialog(true);
  }, []);
  const onCloseTransactionDialog = useCallback(() => {
    setOpenTransactionDialog(false);
  }, []);

  if(!isConnected) {
    return (
      <></>
    );
  }

  return (
    <StyledRootDiv>
      <StyledButton
        variant="contained"
        onClick={onOpenTransactionDialog}
        startIcon={pendingTransactions.length > 0 ?
          <CircularProgress size={16} color="inherit" /> :
          <SwapVerticalCircleRoundedIcon sx={{ fontSize: '20px', color: theme.palette.primary.main }}/>}
      >
        {pendingTransactions.length > 0 ? `${pendingTransactions.length} ${dict.transaction_button.pending}` : `${dict.transaction_button.transactions}`}
      </StyledButton>
      <StyledIconButton onClick={onOpenTransactionDialog}>
        {pendingTransactions.length > 0 ?
          <CircularProgress size={16} color="inherit" /> :
          <SwapVerticalCircleRoundedIcon sx={{ fontSize: '20px', color: theme.palette.primary.main }}/>}
      </StyledIconButton>
      <RecentTransactionDialog
        open={openTransactionDialog}
        onClose={onCloseTransactionDialog}
      />
    </StyledRootDiv>
  );
}

const StyledRootDiv = styled("div")(({ theme }) => ({
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '12px',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '22.4px',
  letterSpacing: 0,
  padding: '6px 12px',
  boxShadow: 'none',
  background: "white",
  border: "1px solid #EDEEF2",
  color: "#000000",
  '@media (max-width: 960px)': {
    display: "none",
  },
}));

const StyledIconButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '12px',
  padding: '6px 12px',
  boxShadow: 'none',
  background: "white",
  border: "1px solid #EDEEF2",
  display: "none",
  '@media (max-width: 960px)': {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));