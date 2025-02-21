import React from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import Link from "next/link";
import { useDict } from "../../contexts/DictContext";
import { AppRoute } from "@/enums/route";
import { styled } from "@mui/material/styles";
import { usePathname } from "next/navigation";

const LinkButton = styled("div")<{ isActive?: boolean }>(
  ({ theme, isActive }) => ({
    padding: `${theme.spacing(2)} ${theme.spacing(7)}`,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    backgroundColor: isActive ? "#f4f6f8" : "none",
    color: isActive ? "#000" : "#667085",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      padding: `${theme.spacing(1.5)} ${theme.spacing(4)}`,
    },
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

export default function Layout(props: { children: React.ReactNode }) {
  const dict = useDict();
  const pathname = usePathname();

  return (
    <Box>
      <Header />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={"100vh"}
      >
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
      </Box>
    </Box>
  );
}
