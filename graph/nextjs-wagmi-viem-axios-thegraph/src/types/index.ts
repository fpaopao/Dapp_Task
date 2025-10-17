export interface Transfer {
  id: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  transactionHash: string;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface GraphResponse {
  transfers: Transfer[];
  token?: TokenInfo;
}

export interface ChainConfig {
  chainId: number;
  contractAddress: `0x${string}`;
  graphUrl: string;
  rpcUrl: string;
}

// demo/page.tsx
export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  totalTransfers: string;
  totalHolders: string;
}

export interface TransferData {
  id: string;
  from: string;
  to: string;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHashBytes: string;
}

export interface MetaData {
  _meta: {
    block: { number: number };
    hasIndexingErrors: boolean;
  };
}

export interface UserData {
  id: string;
  balance: string;
}
