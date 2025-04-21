import { LocalStorageKey } from '@/consts/local-storage-key';
import { Token } from '@/enums/token';
import { load, save } from '@/utils/local.storage.utils';
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

class LocalStorageService {
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