import { Address } from "viem";

export interface ContractWriteResult {
  hash?: string;
  status: "success" | "error" | "loading" | "idle";
  error?: Error | null;
  data?: any;
}

export interface ContractConfig {
  address: Address;
  abi: any[];
}

export interface ReadOptions {
  enabled?: boolean;
  watch?: boolean;
  cacheTime?: number;
  staleTime?: number;
}

export interface ContractReadResult<T = any> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  status: "success" | "error" | "loading" | "idle";
}

export interface ReadContractConfig {
  address: Address;
  abi: any[];
  functionName: string;
  args?: any[];
  enabled?: boolean;
  watch?: boolean;
  cacheTime?: number;
  staleTime?: number;
}
