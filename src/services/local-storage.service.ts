import { LocalStorageKey } from '@/consts/local-storage-key';
import { Token } from '@/enums/token';
import { TransactionMethod } from '@/enums/transactionMethod';
import { load, remove, save } from '@/utils/local.storage.utils';
import { ethereum, joc } from '@/wagmi.config';

export type PageState = {
  send: {
    fromChainId: number;
    toChainId: number;
    token: string;
  };
  mint: {
    toChainId: number;
    token: string;
  };
  burn: {
    fromChainId: number;
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
    toChainId: ethereum.id,
    token: Token.USDT,
  },
  burn: {
    fromChainId: ethereum.id,
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
  lzEndPointId?: number;
  createdAt: number;
  confirmedTime?: number;
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
    return transactions;
  };

  confirmTransaction (hash: string, confirmedTime: number) {
    const transactions = this.getAllTransactions();
    const index = transactions.findIndex((t: Transaction) => t.hash === hash);
    if (index !== -1) {
      transactions[index].confirmedTime = confirmedTime;
      save(LocalStorageKey.TRANSACTIONS, JSON.stringify(transactions));
    }
    return transactions;
  };

  clearConfirmedTransactions () {
    const transactions = this.getAllTransactions();
    const unConfirmedTransactions = transactions.filter((t: Transaction) => t.confirmedTime === undefined);
    remove(LocalStorageKey.TRANSACTIONS);
    save(LocalStorageKey.TRANSACTIONS, JSON.stringify(unConfirmedTransactions));
    return unConfirmedTransactions;
  };

  getPageState (): PageState {
    const pageState = load(LocalStorageKey.PAGE_STATE);
    return pageState !== null ? JSON.parse(pageState) : INITIAL_PAGE_STATE;
  };

  setPageState (state: {
    sendFromChainId?: number;
    sendToChainId?: number;
    sendToken?: string;
    mintToChainId?: number;
    mintToken?: string;
    burnFromChainId?: number;
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
    save(LocalStorageKey.PAGE_STATE, JSON.stringify(pageState));
    return pageState;
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;