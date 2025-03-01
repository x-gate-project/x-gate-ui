"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Button from "@mui/material/Button";
import Link from "next/link";
import { AppRoute } from "@/enums/route";
import { CHAIN_ID_TO_ICON_MAP, ethereum } from "@/wagmi.config";
import { useChainId, useConfig } from "wagmi";
import NetworkChangePopover from "@/components/NetworkChangePopover";
import { usePageState } from "@/contexts/PageStateContext";
import { switchChain } from "wagmi/actions";
import { useDict } from "@/contexts/DictContext";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuPopover from "./MenuPopover";
import localStorageService from "@/services/local-storage.service";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

export default function Header() {
  const dict = useDict();
  const wagmiConfig = useConfig();
  const { enqueueSnackbar } = useSnackbar();
  const { pageState, setPageState } = usePageState();
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const fromNetwork = useMemo(
    () =>
      wagmiConfig.chains.find(
        (chain) => chain.id === pageState.send.fromChainId
      ) || ethereum,
    [pageState, wagmiConfig]
  );

  const chainId = useChainId();

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
      setIsSwitchingNetwork(true);
      try {
        await switchChain(wagmiConfig, { chainId: network.id });
        setFromNetworkChangePopoverAnchorEl(null);
        const pageState = localStorageService.setPageState({
          sendFromChainId: network.id,
          burnFromChainId: network.id,
        });
        setPageState(pageState);
      } catch (error: any) {
        enqueueSnackbar(error.message, { variant: "error" });
      } finally {
        setIsSwitchingNetwork(false);
      }
    },
    [setPageState, wagmiConfig, enqueueSnackbar]
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

  useEffect(() => {
    if(chainId !== pageState.send.fromChainId) {
      switchChain(wagmiConfig, { chainId: pageState.send.fromChainId });
    }
  }, [pageState, chainId, wagmiConfig]);

  return (
    <StyledRootDiv>
      <StyledContainerDiv>
        <StyledAppBarDiv>
          <StyledLeftDiv>
            <Link href={AppRoute.HOME}>
              <StyledTransferButton>{dict.dashboard.transfer_title}</StyledTransferButton>
            </Link>
            <Box display="flex" flexDirection="row">
              <Link
                href={process.env.NEXT_PUBLIC_SWAP_PAGE_LINK || ""}
                target='_self'
              >
                <StyledLinkButton>{dict.dashboard.swap_title}</StyledLinkButton>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_POOL_PAGE_LINK || ""}
                target='_self'
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
              {isSwitchingNetwork ? <CircularProgress size={16} color="inherit" /> : <Image
                src="/icons/arrow-down.svg"
                alt="USDT"
                width={16}
                height={16}
              />}
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
    "radial-gradient(circle at top,rgb(186, 237, 253) 0%,rgb(233, 247, 250) 50%,rgb(247, 251, 252) 100%)",
}));

const StyledContainerDiv = styled("div")(({ theme }) => ({
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingTop: '15.25px',
  paddingBottom: '15.25px',
  margin: "auto",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '12px',
    paddingRight: '12px',
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
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
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
  padding: `12px 16px`,
  fontSize: "16px",
  fontWeight: 500,
  cursor: "pointer",
  color: "#565A69",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledTransferButton = styled("div")(({ theme }) => ({
  padding: `12px 16px`,
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",
  color: "black",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
