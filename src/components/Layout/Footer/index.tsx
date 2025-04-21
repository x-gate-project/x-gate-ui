"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import NetworkSwitcher from "../NetworkSwitcher";
import { ConnectKitButton } from "connectkit";
import WalletButton from "../WalletButton";

export default function Footer() {
  return (
    <StyledRootDiv>
      <StyledContainerDiv>
        <StyledAppBarDiv>
          <StyledLeftDiv>
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress }) => (
                <WalletButton isConnected={isConnected} show={show} truncatedAddress={truncatedAddress} />
              )}
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
    "white",
  display: "none",
  '@media (max-width: 960px)': {
    display: "block",
  },
  borderTop: "1px solid #0000001A",
}));

const StyledContainerDiv = styled("div")(({ theme }) => ({
  paddingLeft: '12px',
  paddingRight: '12px',
  paddingTop: '18px',
  paddingBottom: '18px',
  margin: "auto",
  position: "relative",
}));

const StyledAppBarDiv = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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
