import { Token } from "@/enums/token";
import { CHAIN_ID_TO_JOCX_ADDRESS_MAP, CHAIN_ID_TO_USDA_ADDRESS_MAP, CHAIN_ID_TO_USDCX_ADDRESS_MAP, CHAIN_ID_TO_USDTX_ADDRESS_MAP } from "@/wagmi.config";
import { Chain } from "viem";

export const TOKEN_TO_ICON_MAP = {
  [Token.USDTX]: '/icons/usdtx-icon.svg',
  [Token.USDCX]: '/icons/usdcx-icon.svg',
  [Token.USDT]: '/icons/usdt.svg',
  [Token.USDC]: '/icons/usdc.svg',
  [Token.JOCX]: '/icons/japan-open-chain.svg',
  [Token.JOC]: '/icons/japan-open-chain.svg',
  [Token.USDA]: '/icons/usda-icon.svg',
}

export const TOKEN_TO_DECIMALS_MAP = {
  [Token.USDTX]: 6,
  [Token.USDCX]: 6,
  [Token.USDT]: 6,
  [Token.USDC]: 6,
  [Token.JOCX]: 9,
  [Token.JOC]: 9,
  [Token.USDA]: 6,
}

export const getTokenAddress = (token: Token, network: Chain) => {
  switch (token) {
    case Token.USDTX:
      return CHAIN_ID_TO_USDTX_ADDRESS_MAP[network.id];
    case Token.USDCX:
      return CHAIN_ID_TO_USDCX_ADDRESS_MAP[network.id];
    case Token.JOCX:
      return CHAIN_ID_TO_JOCX_ADDRESS_MAP[network.id];
    case Token.USDA:
      return CHAIN_ID_TO_USDA_ADDRESS_MAP[network.id];
    case Token.USDT:
      return process.env.NEXT_PUBLIC_USDT_ETHEREUM_ADDRESS;
    case Token.USDC:
      return process.env.NEXT_PUBLIC_USDC_ETHEREUM_ADDRESS;
    default:
      return undefined;
  }
}

export const PAIR_TOKENS = {
  [Token.USDT]: {
    mintToTokens: [Token.USDTX, Token.USDA],
    burnToTokens: []
  },
  [Token.USDC]: {
    mintToTokens: [Token.USDCX, Token.USDA],
    burnToTokens: []
  },
  [Token.USDCX]: {
    mintToTokens: [Token.USDA],
    burnToTokens: [Token.USDC]
  },
  [Token.USDTX]: {
    mintToTokens: [Token.USDA],
    burnToTokens: [Token.USDT]
  },
  [Token.JOC]: {
    mintToTokens: [Token.JOCX],
    burnToTokens: []
  },
  [Token.JOCX]: {
    mintToTokens: [],
    burnToTokens: [Token.JOC]
  },
  [Token.USDA]: {
    mintToTokens: [],
    burnToTokens: [Token.USDT, Token.USDC]
  },
}