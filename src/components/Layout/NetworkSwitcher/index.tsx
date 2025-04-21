"use client";

import React, { useCallback, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Button from "@mui/material/Button";
import { CHAIN_ID_TO_ICON_MAP } from "@/wagmi.config";
import { useAccount, useConfig } from "wagmi";
import NetworkChangePopover from "@/components/NetworkChangePopover";
import { switchChain } from "wagmi/actions";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

interface NetworkSwitcherProps {
  buttonStyles?: React.CSSProperties; // Optional prop
}

export default function NetworkSwitcher({ buttonStyles }: NetworkSwitcherProps) {
  const wagmiConfig = useConfig();
  const { chainId } = useAccount();
  const { enqueueSnackbar } = useSnackbar();
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const currentNetwork = useMemo(() => wagmiConfig.chains.find((chain) => chain.id === chainId), [wagmiConfig, chainId]);

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
      } catch (error: any) {
        enqueueSnackbar(error.message, { variant: "error" });
      } finally {
        setIsSwitchingNetwork(false);
      }
    },
    [wagmiConfig, enqueueSnackbar]
  );

  return (
    <StyledRootDiv>
      <StyledSwitchNetworkButton onClick={onOpenFromNetworkChangePopover} style={buttonStyles}>
        {currentNetwork && <Image
          src={CHAIN_ID_TO_ICON_MAP[currentNetwork.id]}
          alt={currentNetwork.name}
          width={16}
          height={16}
        />}
        <StyledSelectedNetworkTitle>
          {currentNetwork ? currentNetwork.name : 'Unsupported Network'}
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
        selectedNetwork={currentNetwork}
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
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 16px",
  gap: "4px",
  background: "#F1F5F9",
  [theme.breakpoints.down("sm")]: {
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
  whiteSpace: "nowrap",
  '@media (max-width: 400px)': {
    maxWidth: "120px",
    marginLeft: "4px",
  },
}));