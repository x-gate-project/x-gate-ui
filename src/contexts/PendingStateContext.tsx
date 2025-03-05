"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";

interface PendingStateContextProps {
  isSending: boolean;
  isMinting: boolean;
  isBurning: boolean;
  layerZeroTxSendingHash: string;
  layerZeroTxMintingHash: string;
  layerZeroTxBurningHash: string;
  setIsSending: (value: boolean) => void;
  setIsMinting: (value: boolean) => void;
  setIsBurning: (value: boolean) => void;
  setLayerZeroTxSendingHash: (value: string) => void;
  setLayerZeroTxMintingHash: (value: string) => void;
  setLayerZeroTxBurningHash: (value: string) => void;
}

const PendingStateContext = createContext<PendingStateContextProps | undefined>(undefined);

export const PendingStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isSending, setIsSending] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [layerZeroTxSendingHash, setLayerZeroTxSendingHash] = useState("");
  const [layerZeroTxMintingHash, setLayerZeroTxMintingHash] = useState("");
  const [layerZeroTxBurningHash, setLayerZeroTxBurningHash] = useState("");

  return (
    <PendingStateContext.Provider value={{
        isSending,
        isMinting,
        isBurning,
        layerZeroTxSendingHash,
        layerZeroTxMintingHash,
        layerZeroTxBurningHash,
        setIsSending,
        setIsMinting,
        setIsBurning,
        setLayerZeroTxSendingHash,
        setLayerZeroTxMintingHash,
        setLayerZeroTxBurningHash
      }}>
      {children}
    </PendingStateContext.Provider>
  );
};

export function usePendingState(): PendingStateContextProps {
  const context = useContext(PendingStateContext);
  if (!context) {
    throw new Error("usePendingState must be used within a PendingStateProvider");
  }
  return context;
}

