"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Chain } from "viem";

type DialogNetworkFilterContextType = {
  fromDialogNetworkFilter: Chain | null;
  toDialogNetworkFilter: Chain | null;
  setFromDialogNetworkFilter: (network: Chain | null) => void;
  setToDialogNetworkFilter: (network: Chain | null) => void;
};

const DialogNetworkFilterContext = createContext<DialogNetworkFilterContextType | undefined>(
  undefined
);

export const DialogNetworkFilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [fromDialogNetworkFilter, setFromDialogNetworkFilter] = useState<Chain | null>(null);
  const [toDialogNetworkFilter, setToDialogNetworkFilter] = useState<Chain | null>(null);

  return (
    <DialogNetworkFilterContext.Provider
      value={{
        fromDialogNetworkFilter,
        toDialogNetworkFilter,
        setFromDialogNetworkFilter,
        setToDialogNetworkFilter,
      }}
    >
      {children}
    </DialogNetworkFilterContext.Provider>
  );
};

export function useDialogNetworkFilter() {
  const context = useContext(DialogNetworkFilterContext);
  if (context === undefined) {
    throw new Error(
      "useDialogNetworkFilter must be used within a DialogNetworkFilterProvider"
    );
  }
  return context;
}

