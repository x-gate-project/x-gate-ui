import { ethereum } from "@/wagmi.config";
import { isProduction } from "./system";

export const ellipsifyText = (text: string, first: number, last: number) =>
  `${text.slice(0, first)}...${text.slice(-last)}`;

export const getLayerZeroTxLink = (hash: string) =>
  `${isProduction ? "https://layerzeroscan.com/" : "https://testnet.layerzeroscan.com/"}/tx/${hash}`;

export const getEtherscanTxLink = (hash: string) =>
  `${ethereum.blockExplorers.default.url}/tx/${hash}`;


