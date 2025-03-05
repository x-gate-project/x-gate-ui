"use client";

import React, { useMemo } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useDict } from "@/contexts/DictContext";
import { useAccount, useBalance } from "wagmi";
import { usePendingState } from "@/contexts/PendingStateContext";
import CircularProgress from "@mui/material/CircularProgress";

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
  const { isSending, isMinting, isBurning } = usePendingState();
  const loading = useMemo(() => isSending || isMinting || isBurning, [isSending, isMinting, isBurning]);

  const balance = data ? Number(data?.formatted).toFixed(2) : "";
  const unit = data?.symbol || "";

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
      <StyledBalanceTitle>{balance} {unit}</StyledBalanceTitle>
      <Button
        variant="contained"
        onClick={show}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
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
        {truncatedAddress}
      </Button>
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

const StyledBalanceTitle = styled("div")(({ theme }) => ({
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "22.4px",
  letterSpacing: "0%",
  color: "#000000",
  paddingLeft: "12px",
  '@media (max-width: 400px)': {
    display: "none",
  },
}));
