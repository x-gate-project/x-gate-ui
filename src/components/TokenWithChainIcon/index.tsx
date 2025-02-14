"use client";

import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";

interface IProps {
  tokenIcon: string;
  chainIcon: string;
  width?: string | number;
  height?: string | number;
}

const TokenWithChainIcon: React.FC<IProps> = ({
  tokenIcon,
  chainIcon,
  width,
  height,
}) => {
  return (
    <Box width={width} height={height} position={"relative"}>
      <Box width="100%" height="100%">
        <Image
          src={tokenIcon}
          alt=""
          width={Number(width)}
          height={Number(height)}
        />
      </Box>
      <Box position={"absolute"} bottom={0} right={0}>
        <Image
          src={chainIcon}
          alt=""
          width={Number(width) / 2}
          height={Number(height) / 2}
          style={{ position: "absolute", bottom: 0, right: 0 }}
        />
      </Box>
    </Box>
  );
};

export default TokenWithChainIcon;
