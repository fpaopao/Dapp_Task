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
