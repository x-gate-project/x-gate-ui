import { ethereum } from "@/wagmi/config";
import { isProduction } from "./system";

export const ellipsifyText = (text: string, first: number, last: number) =>
  `${text.slice(0, first)}...${text.slice(-last)}`;

export const getXGateScanTxLink = (hash: string) =>
  `${isProduction ? "https://scan.x-gate.org" : "https://scan.testnet.x-gate.org/testnet"}/tx/${hash}`;

export const getEtherscanTxLink = (hash: string) =>
  `${ethereum.blockExplorers.default.url}/tx/${hash}`;


