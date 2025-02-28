"use client";

import React, { useCallback, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Button from "@mui/material/Button";
import Link from "next/link";
import { AppRoute } from "@/enums/route";
import { CHAIN_ID_TO_ICON_MAP, ethereum } from "@/wagmi.config";
import { useConfig } from "wagmi";
import NetworkChangePopover from "@/components/NetworkChangePopover";
import { usePageState } from "@/contexts/PageStateContext";
import { switchChain } from "wagmi/actions";
import { useDict } from "@/contexts/DictContext";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuPopover from "./MenuPopover";
import localStorageService from "@/services/local-storage.service";

export default function Header() {
  const dict = useDict();
  const wagmiConfig = useConfig();
  const { pageState, setPageState } = usePageState();
  const fromNetwork = useMemo(
    () =>
      wagmiConfig.chains.find(
        (chain) => chain.id === pageState.send.fromChainId
      ) || ethereum,
    [pageState, wagmiConfig]
  );

  const [
    fromNetworkChangePopoverAnchorEl,
    setFromNetworkChangePopoverAnchorEl,
  ] = useState<HTMLElement | null>(null);
  const onOpenFromNetworkChangePopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setFromNetworkChangePopoverAnchorEl(event.currentTarget);
    },
    [setFromNetworkChangePopoverAnchorEl]
  );
  const onCloseFromNetworkChangePopover = useCallback(() => {
    setFromNetworkChangePopoverAnchorEl(null);
  }, [setFromNetworkChangePopoverAnchorEl]);

  const handleSelectFromNetwork = useCallback(
    async (network: any) => {
      await switchChain(wagmiConfig, { chainId: network.id });
      setFromNetworkChangePopoverAnchorEl(null);
      const pageState = localStorageService.setPageState({
        sendFromChainId: network.id,
        burnFromChainId: network.id,
      });
      setPageState(pageState);
    },
    [setPageState, wagmiConfig]
  );

  const [menuPopoverAnchorEl, setMenuPopoverAnchorEl] =
    useState<HTMLElement | null>(null);
  const onOpenMenuPopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setMenuPopoverAnchorEl(event.currentTarget);
    },
    [setMenuPopoverAnchorEl]
  );
  const onCloseMenuPopover = useCallback(() => {
    setMenuPopoverAnchorEl(null);
  }, [setMenuPopoverAnchorEl]);

  return (
    <StyledRootDiv>
      <StyledContainerDiv>
        <StyledAppBarDiv>
          <StyledLeftDiv>
            <Link href={AppRoute.HOME}>
              <StyledMenuItemDiv>
                <Image
                  alt="Icon"
                  src="/icons/logo.svg"
                  width={69}
                  height={24}
                />
              </StyledMenuItemDiv>
            </Link>
            <Box display="flex" flexDirection="row">
              <Link
                href={process.env.NEXT_PUBLIC_SWAP_URL || ""}
                target="_blank"
              >
                <StyledLinkButton>{dict.dashboard.swap_title}</StyledLinkButton>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_POOL_URL || ""}
                target="_blank"
              >
                <StyledLinkButton>{dict.dashboard.pool_title}</StyledLinkButton>
              </Link>
            </Box>
            <StyledMenuButton onClick={onOpenMenuPopover}>
              <Image
                src="/icons/menu-icon.svg"
                alt="Menu"
                width={20}
                height={20}
              />
            </StyledMenuButton>
          </StyledLeftDiv>
          <StyledRightDiv>
            <StyledSwitchNetworkButton onClick={onOpenFromNetworkChangePopover}>
              <Image
                src={CHAIN_ID_TO_ICON_MAP[fromNetwork.id]}
                alt={fromNetwork.name}
                width={16}
                height={16}
              />
              <StyledSelectedNetworkTitle>
                {fromNetwork.name}
              </StyledSelectedNetworkTitle>
              <Image
                src="/icons/arrow-down.svg"
                alt="USDT"
                width={16}
                height={16}
              />
            </StyledSwitchNetworkButton>
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress }) => (
                <Button
                  variant="contained"
                  onClick={show}
                  startIcon={
                    <Image
                      src="/icons/wallet-icon.svg"
                      alt="Wallet"
                      width={16}
                      height={16}
                    />
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "24px",
                    letterSpacing: 0,
                  }}
                >
                  {isConnected ? truncatedAddress : "Connect Wallet"}
                </Button>
              )}
            </ConnectKitButton.Custom>
          </StyledRightDiv>
        </StyledAppBarDiv>
      </StyledContainerDiv>
      <NetworkChangePopover
        open={Boolean(fromNetworkChangePopoverAnchorEl)}
        onClose={onCloseFromNetworkChangePopover}
        onChangeNetwork={handleSelectFromNetwork}
        anchorEl={fromNetworkChangePopoverAnchorEl}
        selectedNetwork={fromNetwork}
        networks={wagmiConfig.chains as any}
      />
      <MenuPopover
        open={Boolean(menuPopoverAnchorEl)}
        onClose={onCloseMenuPopover}
        anchorEl={menuPopoverAnchorEl}
      />
    </StyledRootDiv>
  );
}

const StyledRootDiv = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  background:
    "radial-gradient(circle at top, #d9f3ff 0%, #e9f8ff 50%, #f5fcff 100%)",
}));

const StyledContainerDiv = styled("div")(({ theme }) => ({
  paddingLeft: 20,
  paddingRight: 20,
  margin: "auto",
  position: "relative",
  [theme.breakpoints.up("md")]: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  borderBottom: "1px solid #0000001A",
}));

const StyledAppBarDiv = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: 70,
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
    height: 60,
  },
}));

const StyledLeftDiv = styled("div")(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "12px",
    justifyContent: "center",
  },
}));

const StyledRightDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "12px",
    justifyContent: "center",
  },
}));

const StyledMenuItemDiv = styled("div")(({ theme }) => ({
  color: "black",
  paddingLeft: 25,
  paddingRight: 25,
  textDecoration: "none",
  fontSize: 16,
  height: "100%",
  display: "flex",
  alignItems: "center",
  paddingTop: "12px",
  paddingBottom: "12px",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    color: "grey",
    textDecoration: "none",
    fontSize: 16,
    height: "100%",
    display: "flex",
    alignItems: "center",
    paddingBottom: "12px",
  },
}));

const StyledSwitchNetworkButton = styled(Button)(({ theme }) => ({
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
  background: "white",
  maxWidth: "200px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "115px",
    padding: "8px 8px",
  },
}));

const StyledSelectedNetworkTitle = styled("div")(({ theme }) => ({
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "24px",
  letterSpacing: "0%",
  maxLines: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100px",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledLinkButton = styled("div")(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  color: "#565A69",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledDropdownItem = styled("div")(({ theme }) => ({
  position: "relative",
  color: "black",
  fontSize: 16,
  paddingLeft: 20,
  paddingRight: 20,
  textDecoration: "none",
  display: "flex",
  height: 50,
  alignItems: "center",
  textAlign: "left",
  "&:hover": {
    background: "#F1F5F9",
  },
}));
