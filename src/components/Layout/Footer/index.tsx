"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import NetworkSwitcher from "../NetworkSwitcher";
import { ConnectKitButton } from "connectkit";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useDict } from "@/contexts/DictContext";

export default function Footer() {
  const dict = useDict();
  return (
    <StyledRootDiv>
      <StyledContainerDiv>
        <StyledAppBarDiv>
          <StyledLeftDiv>
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress }) => (
                <Button
                  variant="contained"
                  onClick={show}
                  startIcon={<Image src="/icons/wallet-icon.svg" alt="Wallet" width={16} height={16} />}
                  sx={{
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "24px",
                    letterSpacing: 0,
                  }}
                  >
                  {isConnected ? truncatedAddress : dict.header.connect_wallet}
              </Button>)}
            </ConnectKitButton.Custom>
          </StyledLeftDiv>
          <StyledRightDiv>
            <NetworkSwitcher />
          </StyledRightDiv>
        </StyledAppBarDiv>
      </StyledContainerDiv>
    </StyledRootDiv>
  );
}

const StyledRootDiv = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  borderRadius: "12px 12px 0 0",
  background:
    "radial-gradient(circle at top,rgb(186, 237, 253) 0%,rgb(233, 247, 250) 50%,rgb(247, 251, 252) 100%)",
  display: "none",
  '@media (max-width: 960px)': {
    display: "block",
  },
  borderTop: "1px solid #0000001A",
}));

const StyledContainerDiv = styled("div")(({ theme }) => ({
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingTop: '15.25px',
  paddingBottom: '15.25px',
  margin: "auto",
  position: "relative",
  '@media (max-width: 960px)': {
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
}));

const StyledAppBarDiv = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
  },
}));

const StyledLeftDiv = styled("div")(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
  },
}));

const StyledRightDiv = styled("div")(({ theme }) => ({
  display: "flex",
}));
