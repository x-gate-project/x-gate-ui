"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Link from "next/link";
import { AppRoute } from "@/enums/route";
import { useDict } from "@/contexts/DictContext";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import NetworkSwitcher from "../NetworkSwitcher";

export default function Header() {
  const dict = useDict();

  return (
    <StyledRootDiv>
      <StyledContainerDiv>
        <StyledAppBarDiv>
          <StyledLeftDiv>
            <Link href={AppRoute.HOME}>
              <StyledLeftTransferButton>{dict.dashboard.transfer_title}</StyledLeftTransferButton>
            </Link>
            <StyledLeftNavigationDiv>
              <Link
                href={process.env.NEXT_PUBLIC_SWAP_URL || ""}
                target='_self'
              >
                <StyledLinkButton>{dict.dashboard.swap_title}</StyledLinkButton>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_POOL_URL || ""}
                target='_self'
              >
                <StyledLinkButton>{dict.dashboard.pool_title}</StyledLinkButton>
              </Link>
            </StyledLeftNavigationDiv>
          </StyledLeftDiv>
          <StyledRightDiv>
              <StyledWalletSwitcherContainerDiv>
                <NetworkSwitcher />
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
              </StyledWalletSwitcherContainerDiv>
            <StyledRightNavigationDiv>
              <StyledRightTransferButton>{dict.dashboard.transfer_title}</StyledRightTransferButton>
              <Link
                href={process.env.NEXT_PUBLIC_SWAP_URL || ""}
                target='_self'
              >
                <StyledLinkButton>{dict.dashboard.swap_title}</StyledLinkButton>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_POOL_URL || ""}
                target='_self'
              >
                <StyledLinkButton>{dict.dashboard.pool_title}</StyledLinkButton>
              </Link>
            </StyledRightNavigationDiv>
          </StyledRightDiv>
        </StyledAppBarDiv>
      </StyledContainerDiv>
    </StyledRootDiv>
  );
}

const StyledRootDiv = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  background: "transparent",
}));

const StyledContainerDiv = styled("div")(({ theme }) => ({
  paddingLeft: '12px',
  paddingRight: '12px',
  paddingTop: '13.5px',
  paddingBottom: '13.5px',
  margin: "auto",
  position: "relative",
  '@media (max-width: 960px)': {
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  '@media (max-width: 500px)': {
    paddingTop: '12.5px',
    paddingBottom: '12.5px',
  },
  borderBottom: "1px solid #0000001A",
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

const StyledLinkButton = styled("div")(({ theme }) => ({
  padding: `12px 16px`,
  fontSize: "16px",
  fontWeight: 500,
  cursor: "pointer",
  color: "#565A69",
}));

const StyledLeftTransferButton = styled("div")(({ theme }) => ({
  padding: `12px 16px`,
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",
  color: "black",
  '@media (max-width: 960px)': {
    display: "none",
  },
}));

const StyledRightTransferButton = styled("div")(({ theme }) => ({
  padding: `12px 16px`,
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",
  color: "black",
  display: "none",
  '@media (max-width: 960px)': {
    display: "block",
  },
}));

const StyledLeftNavigationDiv = styled("div")(({ theme }) => ({
  display: "flex",
  '@media (max-width: 960px)': {
    display: "none",
  },
}));

const StyledRightNavigationDiv = styled("div")(({ theme }) => ({
  display: "none",
  '@media (max-width: 960px)': {
    display: "flex",
    flexDirection: "row",
  },
}));

const StyledWalletSwitcherContainerDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  '@media (max-width: 960px)': {
    display: "none",
  },
}));
