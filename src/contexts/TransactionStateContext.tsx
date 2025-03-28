"use client";

import localStorageService, { Transaction } from "@/services/local-storage.service";
import { waitForMessageReceived } from "@layerzerolabs/scan-client";
import { enqueueSnackbar } from "notistack";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
  useRef,
} from "react";
import { useAccount, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useDict } from "./DictContext";
import { TransactionMethod } from "@/enums/transaction-method";

interface TransactionStateContextProps {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction, waitForSuccess: () => Promise<void>) => Promise<void>;
  clearConfirmedTransactions: () => void;
}

const TransactionStateContext = createContext<TransactionStateContextProps | undefined>(undefined);

export const TransactionStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const hasRunRef = useRef(false);

  const { address, isDisconnected } = useAccount();
  const wagmiConfig = useConfig();
  const dict = useDict();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address || hasRunRef.current || isDisconnected) return;
      hasRunRef.current = true;

      const storedTransactions = localStorageService.getTransactionsByWalletAddress(address);
      if (storedTransactions) {
        setTransactions(storedTransactions);
      }

      for (const tx of storedTransactions) {
        if (!tx.confirmedAt) {
          try {
            if (tx.lzEndpointId) {
              await waitForMessageReceived(tx.lzEndpointId, tx.hash);
            } else {
              await waitForTransactionReceipt(wagmiConfig, {
                hash: tx.hash as `0x${string}`,
              });
            }
            const updatedTime = Date.now();
            const transactions = localStorageService.confirmTransaction(tx.hash, updatedTime);
            setTransactions(transactions.sort((a, b) => a.createdAt - b.createdAt));

            const fromNetwork = wagmiConfig.chains.find((chain) => chain.id === tx.fromChainId)?.name;
            const toNetwork = wagmiConfig.chains.find((chain) => chain.id === tx.toChainId)?.name;

            if (tx.method === TransactionMethod.SEND) {
              enqueueSnackbar(
                dict.send_tab.send_success
                  .replace("{{token}}", tx.token)
                  .replace("{{from}}", fromNetwork!)
                  .replace("{{to}}", toNetwork!),
                { variant: "success" }
              );
            }

            if (tx.method === TransactionMethod.MINT) {
              enqueueSnackbar(
                dict.mint_tab.mint_success
                  .replace("{{token}}", tx.token)
                  .replace("{{from}}", fromNetwork!)
                  .replace("{{to}}", toNetwork!),
                { variant: "success" }
              );
            }

            if (tx.method === TransactionMethod.BURN) {
              enqueueSnackbar(
                dict.burn_tab.burn_success
                  .replace("{{token}}", tx.token)
                  .replace("{{from}}", fromNetwork!)
                  .replace("{{to}}", toNetwork!),
                { variant: "success" }
              );
            }
          } catch (error: any) {
            if (tx.lzEndpointId && !error.message.startsWith("Message failed") && !error.message.startsWith("More than one message")) {
              continue;
            }
            const fromNetwork = wagmiConfig.chains.find((chain) => chain.id === tx.fromChainId)?.name;
            const toNetwork = wagmiConfig.chains.find((chain) => chain.id === tx.toChainId)?.name;

            localStorageService.setTransactionFailed(tx.hash);
            if (tx.method === TransactionMethod.SEND) {
              enqueueSnackbar(
                dict.send_tab.send_failed.replace("{{token}}", tx.token)
                  .replace("{{from}}", fromNetwork!)
                  .replace("{{to}}", toNetwork!)
                  .replace("{{error}}", (error as any).shortMessage || dict.error_page.unknown_error),
                { variant: "error", style: { whiteSpace: "pre-line" } }
              );
            }

            if (tx.method === TransactionMethod.MINT) {
              enqueueSnackbar(
                dict.mint_tab.mint_failed.replace("{{token}}", tx.token)
                  .replace("{{from}}", fromNetwork!)
                  .replace("{{to}}", toNetwork!)
                  .replace("{{error}}", (error as any).shortMessage || dict.error_page.unknown_error),
                { variant: "error", style: { whiteSpace: "pre-line" } }
              );
            }

            if (tx.method === TransactionMethod.BURN) {
              enqueueSnackbar(
                dict.burn_tab.burn_failed.replace("{{token}}", tx.token)
                  .replace("{{from}}", fromNetwork!)
                  .replace("{{to}}", toNetwork!)
                  .replace("{{error}}", (error as any).shortMessage || dict.error_page.unknown_error),
                { variant: "error", style: { whiteSpace: "pre-line" } }
              );
            }
          }
        }
      }

      const newTransactions = localStorageService.getTransactionsByWalletAddress(address).sort((a, b) => a.createdAt - b.createdAt);
      setTransactions(newTransactions);
    };

    fetchTransactions();
  }, [address, wagmiConfig, isDisconnected, dict]);


  // Function to add a transaction
  const addTransaction = async (transaction: Transaction, waitForSuccess: () => Promise<void>) => {
    let transactions: Transaction[] = [];
    try {
      transactions = localStorageService.addTransaction(transaction);
      setTransactions(transactions);
      await waitForSuccess();
      const updatedTime = Date.now();
      transactions = localStorageService.confirmTransaction(transaction.hash, updatedTime);
    } catch (error) {
      transactions = localStorageService.setTransactionFailed(transaction.hash);
      throw error;
    } finally {
      setTransactions(transactions.sort((a, b) => a.createdAt - b.createdAt));
    }
  };

  const clearConfirmedTransactions = () => {
    const confirmedTransactions = localStorageService.clearConfirmedTransactions();
    setTransactions(confirmedTransactions);
  };

  return (
    <TransactionStateContext.Provider value={{
        transactions,
        addTransaction,
        clearConfirmedTransactions
      }}>
      {children}
    </TransactionStateContext.Provider>
  );
};

export function useTransactionState(): TransactionStateContextProps {
  const context = useContext(TransactionStateContext);
  if (!context) {
    throw new Error("useTransactionState must be used within a TransactionStateProvider");
  }
  return context;
}

