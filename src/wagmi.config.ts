import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { defineChain } from "viem";
import { isProduction } from "./utils/system";

export const joc = isProduction
  ? defineChain({
      id: 81,
      name: "Japan Open Chain Mainnet",
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

export function getWagmiConfig() {
  return createConfig({
    chains: [joc, ethereum],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [joc.id]: http(),
      [ethereum.id]: http(),
    } as any,
  });
}
