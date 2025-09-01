import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { ContractWriteResult, ContractConfig } from '../contracts/types';
import { handleContractError } from '../utils/errorHandler';
import { waitForTransactionReceipt } from '@wagmi/core'
import { config as configWagmi } from "@/config/wagmi"

export const useContractWrite = (config: ContractConfig) => {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const [status, setStatus] = useState<ContractWriteResult['status']>('idle');
  const [result, setResult] = useState<any>(null);
  const [id, setId] = useState("")

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash }); 

  const executeWrite = useCallback(async (
    id: string,
    functionName: string,
    args: any[] = [],
    value?: bigint
  ): Promise<ContractWriteResult> => {
    if (!isConnected) {
      const error = new Error('请先连接钱包');
      return { status: 'error', error };
    }

    setStatus('loading');
    setId(id);

    try {
      writeContract({
        address: config.address,
        abi: config.abi,
        functionName,
        args,
        value,
      });

      return { status: 'loading' };

    } catch (error) {
      const contractError = handleContractError(error);
      setStatus('error');
      return { status: 'error', error: contractError };
    }
  }, [isConnected, writeContract, config]);

  // 监听交易状态变化
  useEffect(() => {
    if (isConfirming) setStatus('loading');
    if (isConfirmed) {
      setStatus('success');
      setResult(hash);
    }
    if (error) {
      setStatus('error');
      setResult(null);
    }
  }, [isConfirming, isConfirmed, error, hash]);

  return {
    id,
    executeWrite,
    status,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    result,
    hash
  };
};