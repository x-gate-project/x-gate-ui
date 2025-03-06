"use client";

import React, { useCallback, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useDict } from "@/contexts/DictContext";
import { useAccount, useBalance } from "wagmi";
import { useTransactionState } from "@/contexts/TransactionStateContext";
import CircularProgress from "@mui/material/CircularProgress";
import RecentTransactionDialog from "@/components/RecentTransactionDialog";
import WalletButtonPopover from "./WalletButtonPopover";
import Tooltip from "@mui/material/Tooltip";
import { Box } from "@mui/material";
interface WalletButtonProps {
  isConnected: boolean;
  show: (() => void) | undefined;
  truncatedAddress: string | undefined;
}

export default function WalletButton({ isConnected, show, truncatedAddress }: WalletButtonProps) {
  const dict = useDict();
  const { address, chainId } = useAccount();
  const { data: data } = useBalance({
    address,
    chainId: chainId,
  });
  const { transactions } = useTransactionState();
  const pendingTransactions = useMemo(() => transactions.filter((tx) => tx.confirmedTime === undefined), [transactions]);

  const balance = data?.formatted;
  const unit = data?.symbol || "";

  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const onOpenTransactionDialog = useCallback(() => {
    setOpenTransactionDialog(true);
  }, []);
  const onCloseTransactionDialog = useCallback(() => {
    setOpenTransactionDialog(false);
  }, []);

  const [walletButtonPopoverAnchorEl, setWalletButtonPopoverAnchorEl] = React.useState<HTMLElement | null>(
    null,
  );

  const onOpenWalletButtonPopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setWalletButtonPopoverAnchorEl(event.currentTarget);
    },
    [setWalletButtonPopoverAnchorEl],
  );
  const onCloseWalletButtonPopover = useCallback(() => {
    setWalletButtonPopoverAnchorEl(null);
  }, [setWalletButtonPopoverAnchorEl]);

  if(!isConnected) {
    return (
      <Button
          variant="contained"
          onClick={show}
          sx={{
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '20px',
            letterSpacing: 0,
            padding: '8px 16px',
            boxShadow: 'none',
          }}
        >
          {dict.header.connect_wallet}
      </Button>
    );
  }

  return (
    <StyledRootDiv>
      <Tooltip title={balance}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "end",
            gap: "4px",
            paddingLeft: "12px",
            '@media (max-width: 400px)': {
              display: "none",
            },
          }}
        >
          <Box
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "22.4px",
              letterSpacing: "0%",
              color: "#000000",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "120px",
              '@media (max-width: 720px)': {
                maxWidth: "70px",
              },
              '@media (max-width: 500px)': {
                maxWidth: "50px",
              },
            }}
          >
            {balance}
          </Box>
          <Box
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "22.4px",
              letterSpacing: "0%",
              color: "#000000",
            }}
          >
            {unit}
          </Box>
        </Box>
      </Tooltip>
      <Button
        variant="contained"
        onClick={onOpenWalletButtonPopover}
        startIcon={pendingTransactions.length > 0 ? <CircularProgress size={20} color="inherit" /> : undefined}
        sx={{
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: '22.4px',
          letterSpacing: 0,
          padding: '8px 16px',
          boxShadow: 'none',
          background: "white",
          border: "1px solid #EDEEF2",
          color: "#000000",
        }}
      >
        {pendingTransactions.length > 0 ? `${pendingTransactions.length} pending` : truncatedAddress}
      </Button>
      <RecentTransactionDialog
        open={openTransactionDialog}
        onClose={onCloseTransactionDialog}
      />
      <WalletButtonPopover
        open={Boolean(walletButtonPopoverAnchorEl)}
        onClose={onCloseWalletButtonPopover}
        onOpenProfile={show!}
        onOpenRecentTransactions={onOpenTransactionDialog}
        anchorEl={walletButtonPopoverAnchorEl}
        isPending={pendingTransactions.length > 0}
      />
    </StyledRootDiv>
  );
}

const StyledRootDiv = styled("div")(({ theme }) => ({
  borderRadius: "12px",
  gap: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "none",
  background: "#EDEEF2",
}));

