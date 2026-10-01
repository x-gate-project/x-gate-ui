"use client";

import localStorageService, { Transaction } from "@/services/local-storage.service";
import { waitForMessageReceived } from "@x-gate-project/x-gate-scan-client";
import { enqueueSnackbar } from "notistack";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useAccount, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useDict } from "./DictContext";
import { TransactionMethod } from "@/enums/transaction-method";

interface TransactionStateContextProps {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction, waitForSuccess: () => Promise<void>) => Promise<void>;
  clearCompletedTransactions: () => void;
  isSending: boolean;
  isMinting: boolean;
  isBurning: boolean;
  setIsSending: (isSending: boolean) => void;
  setIsMinting: (isMinting: boolean) => void;
  setIsBurning: (isBurning: boolean) => void;
}

const TransactionStateContext = createContext<TransactionStateContextProps | undefined>(undefined);

export const TransactionStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isDisconnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const processedAddressesRef = useRef<Set<string>>(new Set());
  const wagmiConfig = useConfig();
  const dict = useDict();
  const [isSending, setIsSending] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  const updateTransaction = useCallback(() => {
    if(!address) return;
    const transactions = localStorageService.getTransactionsByWalletAddress(address).sort((a, b) => a.createdAt - b.createdAt);
    setTransactions(transactions);
  }, [address]);

  const showSuccessSnackbar = useCallback((tx: Transaction) => {
    const fromNetwork = wagmiConfig.chains.find((chain) => chain.id === tx.fromChainId)?.name || '';
    const toNetwork = wagmiConfig.chains.find((chain) => chain.id === tx.toChainId)?.name || '';
    let messageTemplate;
    switch (tx.method) {
      case TransactionMethod.SEND:
        messageTemplate = dict.send_tab.send_success;
        break;
      case TransactionMethod.MINT:
        messageTemplate = dict.mint_tab.mint_success;
        break;
      case TransactionMethod.BURN:
        messageTemplate = dict.burn_tab.burn_success;
        break;
      default:
        return;
    }
    enqueueSnackbar(
      messageTemplate
        .replace("{{token}}", tx.token)
        .replace("{{from}}", fromNetwork)
        .replace("{{to}}", toNetwork),
      { variant: "success" }
    );
  }, [wagmiConfig.chains, dict]);

  const showErrorSnackbar = useCallback((tx: Transaction, error: any) => {
    const fromNetwork = wagmiConfig.chains.find((chain) => chain.id === tx.fromChainId)?.name;
    const toNetwork = wagmiConfig.chains.find((chain) => chain.id === tx.toChainId)?.name;
    let messageTemplate;

    switch (tx.method) {
      case TransactionMethod.SEND:
        messageTemplate = dict.send_tab.send_failed;
        break;
      case TransactionMethod.MINT:
        messageTemplate = dict.mint_tab.mint_failed;
        break;
      case TransactionMethod.BURN:
        messageTemplate = dict.burn_tab.burn_failed;
        break;
      default:
        return;
    }

    enqueueSnackbar(
      messageTemplate
        .replace("{{token}}", tx.token)
        .replace("{{from}}", fromNetwork!)
        .replace("{{to}}", toNetwork!)
        .replace("{{error}}", (error as any).shortMessage || dict.error_page.unknown_error),
      { variant: "error", style: { whiteSpace: "pre-line" } }
    );
  }, [wagmiConfig.chains, dict]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address || isDisconnected) return;

      const storedTransactions = localStorageService.getTransactionsByWalletAddress(address);
      if(storedTransactions) {
        setTransactions(storedTransactions);
      }

      if(!processedAddressesRef.current.has(address)) {
        processedAddressesRef.current.add(address);
        for (const tx of storedTransactions) {
          if (!tx.confirmedAt && !tx.isFailed) {
            try {
              if (tx.lzEndpointId) {
                await waitForMessageReceived(tx.lzEndpointId, tx.hash);
              } else {
                await waitForTransactionReceipt(wagmiConfig, {
                  hash: tx.hash as `0x${string}`,
                });
              }

              const updatedTime = Date.now();
              localStorageService.confirmTransaction(tx.hash, updatedTime, address);
              showSuccessSnackbar(tx);
            } catch (error: any) {
              if (tx.lzEndpointId && !error.message.startsWith("Message failed") && !error.message.startsWith("More than one message")) {
                continue;
              }
              localStorageService.setTransactionFailed(tx.hash);

              showErrorSnackbar(tx, error);
            } finally {
              updateTransaction();
              continue;
            }
          }
        }
      }

      processedAddressesRef.current.delete(address);
    };

    fetchTransactions();
  }, [
    address,
    wagmiConfig,
    isDisconnected,
    dict,
    updateTransaction,
    showErrorSnackbar,
    showSuccessSnackbar
  ]);


  // Function to add a transaction
  const addTransaction = async (transaction: Transaction, waitForSuccess: () => Promise<void>) => {
    let transactions: Transaction[] = [];
    if(!address) {
      return;
    }
    try {
      transactions = localStorageService.addTransaction(transaction);
      setTransactions(transactions);
      await waitForSuccess();
      const updatedTime = Date.now();
      transactions = localStorageService.confirmTransaction(transaction.hash, updatedTime, address);
    } catch (error) {
      transactions = localStorageService.setTransactionFailed(transaction.hash);
      throw error;
    } finally {
      setTransactions(transactions.sort((a, b) => a.createdAt - b.createdAt));
    }
  };

  const clearCompletedTransactions = () => {
    if(!address) {
      return;
    }
    const currentAddressUncompletedTransactions = localStorageService.clearCompletedTransactions(address);
    setTransactions(currentAddressUncompletedTransactions);
  };

  return (
    <TransactionStateContext.Provider value={{
        transactions,
        addTransaction,
        clearCompletedTransactions,
        isSending,
        isMinting,
        isBurning,
        setIsSending,
        setIsMinting,
        setIsBurning
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

