"use client";

import React from "react";
import { Box } from "@mui/material";

export default function About() {
  return (
    <Box paddingTop={4} display="flex" flexDirection="column" gap={4}>
        <Box color="text.primary" fontSize={32} fontWeight={600}>About</Box>
        <Box color="text.primary" fontSize={16} fontWeight={400}>Version : {process.env.VERSION}</Box>
    </Box>
  );
}