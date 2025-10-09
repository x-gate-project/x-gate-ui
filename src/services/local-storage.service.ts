import { LocalStorageKey } from '@/consts/local-storage-key';
import { Token } from '@/enums/token';
import { TransactionMethod } from '@/enums/transaction-method';
import { load, remove, save } from '@/utils/local.storage.utils';
import { ethereum, joc } from '@/wagmi/config';

export type PageState = {
  send: {
    fromChainId: number;
    toChainId: number;
    token: string;
  };
  mint: {
    fromChainId: number;
    toChainId: number;
    token: string;
  };
  burn: {
    fromChainId: number;
    toChainId: number;
    token: string;
  };
};

const INITIAL_PAGE_STATE: PageState = {
  send: {
    fromChainId: ethereum.id,
    toChainId: joc.id,
    token: Token.USDTX,
  },
  mint: {
    fromChainId: ethereum.id,
    toChainId: ethereum.id,
    token: Token.USDT,
  },
  burn: {
    fromChainId: ethereum.id,
    toChainId: ethereum.id,
    token: Token.USDTX,
  },
};

export type Transaction = {
  hash: string;
  summary: string;
  fromAddress: string;
  toAddress: string;
  fromChainId: number;
  toChainId: number;
  amount: string;
  method: TransactionMethod;
  token: Token;
  lzEndpointId?: number;
  createdAt: number;
  confirmedAt?: number;
  isFailed?: boolean;
};

class LocalStorageService {

  getAllTransactions (): Transaction[] {
    const transactions = load(LocalStorageKey.TRANSACTIONS);
    return transactions !== null ? JSON.parse(transactions) : [];
  };

  getTransactionsByWalletAddress (walletAddress: string): Transaction[] {
    const transactions = this.getAllTransactions();
    return transactions.filter((transaction: Transaction) => transaction.fromAddress === walletAddress);
  };

  addTransaction (transaction: Transaction) {
    const transactions = this.getAllTransactions();
    transactions.push(transaction);
    save(LocalStorageKey.TRANSACTIONS, JSON.stringify(transactions));
    const updatedTransactions = this.getTransactionsByWalletAddress(transaction.fromAddress)
    return updatedTransactions;
  };

  confirmTransaction (hash: string, confirmedAt: number, walletAddress: string) {
    const transactions = this.getAllTransactions();
    const index = transactions.findIndex((t: Transaction) => t.hash === hash);
    if (index !== -1) {
      transactions[index].confirmedAt = confirmedAt;
      save(LocalStorageKey.TRANSACTIONS, JSON.stringify(transactions));
    }
    const updatedTransactions = this.getTransactionsByWalletAddress(walletAddress)
    return updatedTransactions;
  };

  setTransactionFailed (hash: string) {
    const transactions = this.getAllTransactions();
    const index = transactions.findIndex((t: Transaction) => t.hash === hash);
    if (index !== -1) {
      transactions[index].isFailed = true;
      save(LocalStorageKey.TRANSACTIONS, JSON.stringify(transactions));
    }
    return transactions;
  }

  clearCompletedTransactions (walletAddress: string) {
    const transactions = this.getAllTransactions();
    const currentAddressUncompletedTransactions = transactions.filter((t: Transaction) => t.confirmedAt === undefined && t.isFailed === undefined && t.fromAddress === walletAddress )
    const anotherAddressTransactions = transactions.filter((t: Transaction) => t.fromAddress !== walletAddress );
    const updatedTransactions = [...currentAddressUncompletedTransactions, ...anotherAddressTransactions]
    remove(LocalStorageKey.TRANSACTIONS);
    save(LocalStorageKey.TRANSACTIONS, JSON.stringify(updatedTransactions));
    return currentAddressUncompletedTransactions;
  };

  getPageState (): PageState {
    const pageState = load(LocalStorageKey.PAGE_STATE);
    return pageState !== null ? JSON.parse(pageState) : INITIAL_PAGE_STATE;
  };

  setPageState (state: {
    sendFromChainId?: number;
    sendToChainId?: number;
    sendToken?: string;
    mintFromChainId?: number;
    mintToChainId?: number;
    mintToken?: string;
    burnFromChainId?: number;
    burnToChainId?: number;
    burnToken?: string;
  }) {
    const pageState = this.getPageState();
    if (state.sendFromChainId) {
      pageState.send.fromChainId = state.sendFromChainId;
    }
    if (state.sendToChainId) {
      pageState.send.toChainId = state.sendToChainId;
    }
    if (state.sendToken) {
      pageState.send.token = state.sendToken;
    }
    if (state.mintFromChainId) {
      pageState.mint.fromChainId = state.mintFromChainId;
    }
    if (state.mintToChainId) {
      pageState.mint.toChainId = state.mintToChainId;
    }
    if (state.mintToken) {
      pageState.mint.token = state.mintToken;
    }
    if (state.burnFromChainId) {
      pageState.burn.fromChainId = state.burnFromChainId;
    }
    if (state.burnToken) {
      pageState.burn.token = state.burnToken;
    }
    if (state.burnToChainId) {
      pageState.burn.toChainId = state.burnToChainId;
    }
    save(LocalStorageKey.PAGE_STATE, JSON.stringify(pageState));
    return pageState;
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;