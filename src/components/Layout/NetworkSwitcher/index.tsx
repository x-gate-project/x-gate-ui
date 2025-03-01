"use client";

import React, { useCallback, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Button from "@mui/material/Button";
import { CHAIN_ID_TO_ICON_MAP, ethereum } from "@/wagmi.config";
import { useConfig } from "wagmi";
import NetworkChangePopover from "@/components/NetworkChangePopover";
import { usePageState } from "@/contexts/PageStateContext";
import { switchChain } from "wagmi/actions";
import localStorageService from "@/services/local-storage.service";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

export default function NetworkSwitcher() {
  const wagmiConfig = useConfig();
  const { enqueueSnackbar } = useSnackbar();
  const { pageState, setPageState, setIsSwitchingNetwork, isSwitchingNetwork } = usePageState();
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

  return (
    <StyledRootDiv>
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
      <NetworkChangePopover
        open={Boolean(fromNetworkChangePopoverAnchorEl)}
        onClose={onCloseFromNetworkChangePopover}
        onChangeNetwork={handleSelectFromNetwork}
        anchorEl={fromNetworkChangePopoverAnchorEl}
        selectedNetwork={fromNetwork}
        networks={wagmiConfig.chains as any}
      />
    </StyledRootDiv>
  );
}

const StyledRootDiv = styled("div")(({ theme }) => ({
  display: "flex",
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