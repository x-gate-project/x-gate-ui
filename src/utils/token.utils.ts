import { Token } from "@/enums/token";

export const TOKEN_TO_ICON_MAP = {
  [Token.USDTX]: '/icons/usdtx-icon.svg',
  [Token.USDCX]: '/icons/usdcx-icon.svg',
  [Token.USDT]: '/icons/usdt.svg',
  [Token.USDC]: '/icons/usdc.svg',
  [Token.JOCX]: '/icons/japan-open-chain.svg',
  [Token.JOC]: '/icons/japan-open-chain.svg',
}

export const TOKEN_TO_DECIMALS_MAP = {
  [Token.USDTX]: 6,
  [Token.USDCX]: 6,
  [Token.USDT]: 6,
  [Token.USDC]: 6,
  [Token.JOCX]: 9,
  [Token.JOC]: 9,
}