import { ethers, Contract, ContractTransactionResponse } from 'ethers';
import {rpcUrl} from "@/config/wagmi"

// 提供商类型
export type EthereumProvider = ethers.BrowserProvider | ethers.JsonRpcProvider;

// 合约读取选项
export interface ReadOptions {
  provider: EthereumProvider;
  contractAddress: string;
  contractABI: any[];
}

// 合约写入选项
export interface WriteOptions extends ReadOptions {
  signer: ethers.Signer;
}

// 通用合约读取函数
export async function readContract<T>(
  options: ReadOptions,
  methodName: string,
  args: any[] = []
): Promise<T> {
  try {
    const contract = new ethers.Contract(
      options.contractAddress,
      options.contractABI,
      options.provider
    );
    
    const result = await contract[methodName](...args);
    return result as T;
  } catch (error) {
    console.error('Error reading contract:', error);
    throw new Error(`Failed to read ${methodName} from contract: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// 通用合约写入函数
export async function writeContract(
  options: WriteOptions,
  methodName: string,
  args: any[] = [],
  overrides: ethers.Overrides = {}
): Promise<ContractTransactionResponse> {
  try {
    const contract = new ethers.Contract(
      options.contractAddress,
      options.contractABI,
      options.signer
    );
    
    const transaction = await contract[methodName](...args, overrides);
    return transaction;
  } catch (error) {
    console.error('Error writing to contract:', error);
    throw new Error(`Failed to execute ${methodName} on contract: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
