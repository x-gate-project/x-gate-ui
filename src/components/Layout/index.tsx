import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import Link from "next/link";
import { useDict } from "../../contexts/DictContext";
import { AppRoute } from "@/enums/route";
import { styled } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";
import { useChainId, useConfig } from "wagmi";
import { useSnackbar } from "notistack";
import { ethereum } from "@/wagmi.config";
import { switchChain } from "wagmi/actions";
import localStorageService from "@/services/local-storage.service";
import { usePageState } from "@/contexts/PageStateContext";
import Footer from "./Footer";

const LinkButton = styled("div")<{ isActive?: boolean }>(
  ({ theme, isActive }) => ({
    padding: `${theme.spacing(1.5)} ${theme.spacing(8)}`,
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: 550,
    lineHeight: '24px',
    border: "none",
    cursor: "pointer",
    backgroundColor: isActive ? "white" : "none",
    color: isActive ? "#000" : "#667085",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      padding: `${theme.spacing(1.5)} ${theme.spacing(4)}`,
    },
    boxShadow: isActive ? "0px 1px 2px 0px #0000000D" : "none",
  })
);

const TabWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: 1,
  paddingRight: 1,
}));

const LinkButtonWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ContentWrapper = styled("div")(({ theme }) => ({
  maxWidth: "500px",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const ContentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: `radial-gradient(circle at top,rgb(186, 237, 253) 0%,rgb(233, 247, 250) 50%,rgb(247, 251, 252) 100%)`,
  [theme.breakpoints.down("sm")]: {
    paddingTop: '16px',
  },
}));

export default function Layout(props: { children: React.ReactNode }) {
  const dict = useDict();
  const pathname = usePathname();
  const router = useRouter();
  const chainId = useChainId();
  const wagmiConfig = useConfig();
  const { enqueueSnackbar } = useSnackbar();
  const { setPageState } = usePageState();
  const { setIsSwitchingNetwork } = usePageState();

  const handleNavigateToMintPage = useCallback(async () => {
    if(chainId === ethereum.id) {
      router.push(AppRoute.MINT);
      return;
    }

    try {
      setIsSwitchingNetwork(true);
      await switchChain(wagmiConfig, { chainId: ethereum.id });
      const pageState = localStorageService.setPageState({
        sendFromChainId: ethereum.id,
        burnFromChainId: ethereum.id,
      });
      setPageState(pageState);
      router.push(AppRoute.MINT);
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsSwitchingNetwork(false);
    }
  }, [router, chainId, wagmiConfig, enqueueSnackbar, setPageState, setIsSwitchingNetwork]);


  return (
    <Box>
      <Header />
      <Footer />
      <ContentContainer>
        <ContentWrapper>
          <TabWrapper>
            <LinkButtonWrapper>
              <Link href={AppRoute.SEND}>
                <LinkButton isActive={pathname?.includes(AppRoute.SEND) ?? false}>
                  {dict.dashboard.send_title}
                </LinkButton>
              </Link>
            </LinkButtonWrapper>
            <LinkButtonWrapper>
              <Box onClick={handleNavigateToMintPage}>
                <LinkButton isActive={pathname?.includes(AppRoute.MINT) ?? false}>
                  {dict.dashboard.mint_title}
                </LinkButton>
              </Box>
            </LinkButtonWrapper>
            <LinkButtonWrapper>
              <Link href={AppRoute.BURN}>
                <LinkButton isActive={pathname?.includes(AppRoute.BURN) ?? false}>
                  {dict.dashboard.burn_title}
                </LinkButton>
              </Link>
            </LinkButtonWrapper>
          </TabWrapper>
          <Box marginTop={2}>{props.children}</Box>
        </ContentWrapper>
      </ContentContainer>
    </Box>
  );
}
