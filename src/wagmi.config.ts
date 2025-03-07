import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia, arbitrum, base, arbitrumSepolia, baseSepolia, avalancheFuji, avalanche } from "wagmi/chains";
import { defineChain } from "viem";
import { isProduction } from "./utils/system";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { walletConnect } from "wagmi/connectors";

export const joc = isProduction
  ? defineChain({
      id: 81,
      name: "Japan Open Chain",
      nativeCurrency: {
        name: "Japan Open Chain Token",
        symbol: "JOC",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: [
            "https://rpc-1.japanopenchain.org:8545",
            "https://rpc-2.japanopenchain.org:8545",
          ],
        },
      },
      blockExplorers: {
        default: {
          name: "Japan Open Chain Explorer",
          url: "https://explorer.japanopenchain.org/",
          apiUrl: "https://explorer.japanopenchain.org/api",
        },
      },
    })
  : defineChain({
      id: 10081,
      name: "Japan Open Chain Testnet",
      nativeCurrency: {
        name: "Japan Open Chain Testnet Token",
        symbol: "JOCT",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: [
            "https://rpc-1.testnet.japanopenchain.org:8545",
            "https://rpc-2.testnet.japanopenchain.org:8545",
          ],
        },
      },
      blockExplorers: {
        default: {
          name: "Japan Open Chain Testnet Explorer",
          url: "https://explorer.testnet.japanopenchain.org/",
          apiUrl: "https://explorer.testnet.japanopenchain.org/api",
        },
      },
      testnet: true,
    });

export const ethereum = isProduction ? mainnet : sepolia;
export const arbitrumNet = isProduction ? arbitrum : arbitrumSepolia;
export const baseNet = isProduction ? base : baseSepolia;
export const avalancheNet = isProduction ? avalanche : avalancheFuji;
export function getWagmiConfig() {
  return createConfig({
    chains: [ethereum, joc, arbitrumNet, baseNet, avalancheNet],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [joc.id]: http(),
      [ethereum.id]: http(),
      [arbitrumNet.id]: http(),
      [avalancheNet.id]: http(),
      [baseNet.id]: http()
    } as any,
    connectors: [
      walletConnect({
        showQrModal: false,
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
      })
    ],
  });
}

export const CHAIN_ID_TO_ICON_MAP = {
  [ethereum.id]: '/icons/ethereum.svg',
  [joc.id]: '/icons/japan-open-chain.svg',
  [arbitrumNet.id]: '/icons/arbitrum.svg',
  [avalancheNet.id]: '/icons/avax.svg',
  [baseNet.id]: '/icons/base.svg',
}

export const CHAIN_ID_TO_USDTX_ADDRESS_MAP = {
  [ethereum.id]: process.env.NEXT_PUBLIC_USDTX_ETHEREUM_ADDRESS,
  [joc.id]: process.env.NEXT_PUBLIC_USDTX_JOC_ADDRESS,
  [arbitrumNet.id]: process.env.NEXT_PUBLIC_USDTX_ARBITRUM_ADDRESS,
  [avalancheNet.id]: process.env.NEXT_PUBLIC_USDTX_AVALANCHE_ADDRESS,
  [baseNet.id]: process.env.NEXT_PUBLIC_USDTX_BASE_ADDRESS,
}

export const CHAIN_ID_TO_USDCX_ADDRESS_MAP = {
  [ethereum.id]: process.env.NEXT_PUBLIC_USDCX_ETHEREUM_ADDRESS,
  [joc.id]: process.env.NEXT_PUBLIC_USDCX_JOC_ADDRESS,
  [arbitrumNet.id]: process.env.NEXT_PUBLIC_USDCX_ARBITRUM_ADDRESS,
  [avalancheNet.id]: process.env.NEXT_PUBLIC_USDCX_AVALANCHE_ADDRESS,
  [baseNet.id]: process.env.NEXT_PUBLIC_USDCX_BASE_ADDRESS,
}

export const CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP = {
  [ethereum.id]: isProduction ? EndpointId.ETHEREUM_V2_MAINNET : EndpointId.SEPOLIA_V2_TESTNET,
  [joc.id]: isProduction ? EndpointId.JOC_V2_MAINNET : EndpointId.JOC_V2_TESTNET,
  [arbitrumNet.id]: isProduction ? EndpointId.ARBITRUM_V2_MAINNET : EndpointId.ARBSEP_V2_TESTNET,
  [avalancheNet.id]: isProduction ? EndpointId.AVALANCHE_V2_MAINNET : EndpointId.AVALANCHE_V2_TESTNET,
  [baseNet.id]: isProduction ? EndpointId.BASE_V2_MAINNET : EndpointId.BASESEP_V2_TESTNET,
}