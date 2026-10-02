import { Chain } from "viem";
import { ethereum } from "@/wagmi/config";
import { isProduction } from "./system";

export const ellipsifyText = (text: string, first: number, last: number) =>
  `${text.slice(0, first)}...${text.slice(-last)}`;

export const getXGateScanTxLink = (hash: string) =>
  `${isProduction ? "https://scan.x-gate.org" : "https://scan.testnet.x-gate.org"}/tx/${hash}`;

// Block explorer of the chain the tx was sent on; falls back to Etherscan.
export const getExplorerTxLink = (chain: Chain | undefined, hash: string) => {
  const url = (chain?.blockExplorers ?? ethereum.blockExplorers).default.url.replace(/\/+$/, "");
  return `${url}/tx/${hash}`;
};


