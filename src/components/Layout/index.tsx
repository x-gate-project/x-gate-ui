import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import Link from "next/link";
import { useDict } from "../../contexts/DictContext";
import { AppRoute } from "@/enums/route";
import { styled } from "@mui/material/styles";
import { usePathname } from "next/navigation";
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
    '@media (max-width: 500px)': {
      padding: `${theme.spacing(1.5)} ${theme.spacing(6)}`,
    },
    '@media (max-width: 375px)': {
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
  '@media (max-width: 500px)': {
    maxWidth: "412px",
  },
  '@media (max-width: 375px)': {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const ContentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  height: "100vh",
  background: `radial-gradient(circle at top,rgb(186, 237, 253) 0%,rgb(233, 247, 250) 50%,rgb(247, 251, 252) 100%)`,
  paddingTop: '110.5px',
  '@media (max-width: 960px)': {
    paddingTop: '92.5px',
  },
  '@media (max-width: 720px)': {
    paddingTop: '62.5px',
  },
  '@media (max-width: 500px)': {
    paddingTop: '78.5px',
  },
}));

export default function Layout(props: { children: React.ReactNode }) {
  const dict = useDict();
  const pathname = usePathname();

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
              <Link href={AppRoute.MINT}>
                <LinkButton isActive={pathname?.includes(AppRoute.MINT) ?? false}>
                  {dict.dashboard.mint_title}
                </LinkButton>
              </Link>
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
