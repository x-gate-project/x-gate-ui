import React from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import Link from "next/link";
import { useDict } from "../../contexts/DictContext";
import { AppRoute } from "@/enums/route";
import { styled, useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";

const LinkButton = styled("div")<{ isActive?: boolean }>(
  ({ theme, isActive }) => ({
    padding: `${theme.spacing(2)} ${theme.spacing(9)}`,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    backgroundColor: isActive ? "#f4f6f8" : "none",
    color: isActive ? "#000" : "#667085",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down("sm")]: {
      padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
    },
  })
);

export default function Layout(props: { children: React.ReactNode }) {
  const dict = useDict();
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <Box>
      <Header />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={"100vh"}
      >
        <Box
          sx={{
            [theme.breakpoints.down("sm")]: {
              width: "95%",
            },
            [theme.breakpoints.down("md")]: {
              width: "85%",
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            width={'100%'}
            paddingLeft={1}
            paddingRight={1}
            alignItems={'center'}
          >
            <Box maxWidth={'30%'}>
              <Link href={AppRoute.SEND}>
                <LinkButton isActive={pathname.includes(AppRoute.SEND)}>
                  {dict.dashboard.send_title}
                </LinkButton>
              </Link>
            </Box>
            <Box maxWidth={'30%'}>
              <Link href={AppRoute.MINT}>
                <LinkButton isActive={pathname.includes(AppRoute.MINT)}>
                  {dict.dashboard.mint_title}
                </LinkButton>
              </Link>
            </Box>
            <Box maxWidth={'30%'}>
              <Link href={AppRoute.BURN}>
                <LinkButton isActive={pathname.includes(AppRoute.BURN)}>
                  {dict.dashboard.burn_title}
                </LinkButton>
              </Link>
            </Box>
          </Box>
          <Box marginTop={2}>{props.children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
