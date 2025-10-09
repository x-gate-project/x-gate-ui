import { defineConfig } from "@wagmi/cli";
import { react, actions } from "@wagmi/cli/plugins";
import erc20Abi from "./src/abis/erc20.json";
import noftxAbi from "./src/abis/noftx.json";
import noftxAdapterAbi from "./src/abis/noftxAdapter.json";
import oftxAbi from "./src/abis/oftx.json";
import oftxHelperAbi from "./src/abis/oftxHelper.json";

export default defineConfig({
  out: "src/wagmi/generated.ts",
  contracts: [
    {
      name: "erc20",
      abi: erc20Abi as any,
    },
    {
      name: "noftx",
      abi: noftxAbi as any,
    },
    {
      name: "noftxAdapter",
      abi: noftxAdapterAbi as any,
    },
    {
      name: "oftx",
      abi: oftxAbi as any,
    },
    {
      name: "oftxHelper",
      abi: oftxHelperAbi as any,
    },
  ],
  plugins: [react(), actions()],
});
