import { estimateFeesPerGas } from "wagmi/actions";
import type { Config } from "wagmi";
import { arbitrumNet } from "@/wagmi/config";

/**
 * Wallets self-estimating on Arbitrum set maxFeePerGas = baseFee, tip = 0 (0% margin),
 * so any base fee uptick between signing and submission gets the tx rejected.
 * EIP-1559 only charges baseFee + tip; unused cap is refunded, so a higher cap costs nothing.
 */
export async function getFeeOverrides(config: Config, chainId: number) {
  // ponytail: Arbitrum only; other chains let the wallet estimate. Add chains here if the error spreads.
  if (chainId !== arbitrumNet.id) return {};
  try {
    const { maxFeePerGas, maxPriorityFeePerGas } = await estimateFeesPerGas(config, { chainId });
    // wagmi already applies 1.2x -> x2 ≈ 2.4x base fee
    return { maxFeePerGas: maxFeePerGas * BigInt(2), maxPriorityFeePerGas };
  } catch {
    return {}; // estimation failed: fall back to wallet estimate
  }
}
