interface RequestArguments {
  method:
    | 'eth_sendTransaction'
    | 'eth_accounts'
    | 'eth_call'
    | 'eth_getBalance'
    | 'eth_sign'
    | 'eth_requestAccounts'
    | 'personal_sign'
    | 'wallet_addEthereumChain'
    | 'wallet_switchEthereumChain';
  params?: unknown[] | Record<string, any>;
}

interface ProviderRpcError extends Error {
  message: string;
  code:
    | 4001 // The request was rejected by the user
    | -32602 // The parameters were invalid
    | -32603; // Internal error
  data?: unknown;
}

interface ConnectInfo {
  chainId: string;
}

interface EthereumProvider {
  isMetaMask: boolean;
  chainId: string;
  networkVersion: string;
  selectedAddress: string;
  autoRefreshOnNetworkChange: boolean;
  isConnected: () => boolean;
  request: <T = any>(args: RequestArguments) => Promise<T>;
  on: (
    name: 'connect' | 'disconnect' | 'accountsChanged' | 'chainChanged' | 'message',
    callback: (value: any) => void,
  ) => void;
  removeListener: (
    name: 'connect' | 'disconnect' | 'accountsChanged' | 'chainChanged' | 'message',
    callback: (value: any) => void,
  ) => void;
}

export declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
