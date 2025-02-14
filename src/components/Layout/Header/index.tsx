"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import { Box } from "@mui/material";

export default function Header() {
  return (
    <StyledRootDiv>
      <StyledContainerDiv>
        <StyledAppBarDiv>
          <StyledLeftDiv>
            <StyledMenuItemDiv>
              <Image alt="Icon" src="/icons/usdtx.svg" width={30} height={30} />
              <Box fontWeight={"bold"} marginLeft={"5px"}>
                X-GATE
              </Box>
            </StyledMenuItemDiv>
          </StyledLeftDiv>
          <StyledRightDiv>
            <ConnectKitButton />
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
  background: "white",
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
}));

const StyledAppBarDiv = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.up("sm")]: {
    height: 50,
  },
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
  },
}));

const StyledLeftDiv = styled("div")(({ theme }) => ({
  display: "flex",
}));

const StyledRightDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "12px",
    flexDirection: "column-reverse",
    justifyContent: "center",
    alignItems: "end",
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
}));
