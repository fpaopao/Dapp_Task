// src/lib/wagmi/hooks.ts
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { useEffect, useState } from 'react';
import { handleContractError } from '@/utils/utils';
import { defaultChainId } from "@/config/wagmi"
import { stakeAbi } from "@/assets/abis/stake"
// 合约地址
export const tokenAddress = "0x4104b3D5F60D682a51Bd7d33e467249F10727263";
export const walletAddress = "0x3623843CB3685FDF05a808c4088b0AAFCB54d33a"


export type ContractConfig = {
  address: String;
  abi: any;
};
/**
 * 读取合约数据的通用 Hook
 *
 * 封装了 wagmi 的 useReadContract，添加了额外的功能：
 * - 统一的加载状态处理
 * - 错误处理
 * - 数据格式化选项
 *
 * @param contract 合约配置
 * @param functionName 函数名
 * @param args 函数参数
 * @param options 额外选项
 * @returns 包含数据和状态的响应对象
 */
export function useContractRead<T = any>(
  contract: ContractConfig,
  functionName: string,
  args?: any[],
  options?: {
    chainId?: number;
    query?: {
      enabled?: boolean;
      refetchInterval?: number;
    };
    formatter?: (data: any) => T; // 数据格式化函数
  }
): {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [error, setError] = useState<string | null>(null);

  const result = useReadContract({
    address: contract.address,
    abi: contract.abi,
    functionName,
    args,
    chainId: options?.chainId,
    query: {
      enabled: options?.query?.enabled ?? true,
      refetchInterval: options?.query?.refetchInterval,
    },
  });

  useEffect(() => {
    if (result.error) {
      setError(handleContractError(result.error));
    } else {
      setError(null);
    }
  }, [result.error]);

  // 格式化数据
  const formattedData = result.data && options?.formatter
    ? options.formatter(result.data)
    : result.data;

  return {
    data: formattedData as T | undefined,
    isLoading: result.isLoading,
    error,
    refetch: result.refetch,
  };
}

/**
 * 写入合约的通用 Hook
 *
 * 封装了 wagmi 的 useWriteContract 和 useWaitForTransactionReceipt，
 * 提供完整的交易生命周期管理：
 * - 发送交易
 * - 等待交易确认
 * - 处理交易结果
 *
 * @param contract 合约配置
 * @param functionName 函数名
 * @param args 函数参数
 * @param value 发送的以太币数量
 * @returns 包含状态和操作的响应对象
 */
export function useContractWrite(
  contract: ContractConfig,
  functionName: string,
  args?: any[],
  value?: bigint
): {
  write: (() => void) | undefined;
  isLoading: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: string | null;
  reset: () => void;
  txHash: `0x${string}` | undefined;
} {
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const {
    writeContract,
    isPending: isWriting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // 合并错误状态
  useEffect(() => {
    const currentError = writeError || receiptError;
    if (currentError) {
      setError(handleContractError(currentError));
    } else {
      setError(null);
    }
  }, [writeError, receiptError]);

  // 执行合约写入操作
  const executeWrite = () => {
    setError(null);
    try {
      const hash = writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName,
        args,
        value,
      });
      setTxHash(hash);
    } catch (err) {
      setError(handleContractError(err as Error));
    }
  };

  // 重置状态
  const reset = () => {
    resetWrite();
    setTxHash(undefined);
    setError(null);
  };

  return {
    write: executeWrite,
    isLoading: isWriting,
    isConfirming,
    isSuccess,
    error,
    reset,
    txHash,
  };
}

/**
 * 使用 MetaNodeStake 合约的专用 Hook
 */
export function useMetaNodeStake(contractAddress?: string, chainId?: number) {
  const { address } = useAccount();
  const contract = {
    address: contractAddress || tokenAddress,
    abi: stakeAbi,
  };

  // 读取质押余额
  const stakeBalance = useContractRead<bigint>(
    contract,
    'stakingBalance',
    [0, address],
    {
      chainId,
      query: {
        enabled: !!address,
        refetchInterval: 10000, // 10秒刷新一次
      },
      formatter: (data) => BigInt(data as string),
    }
  );

  // 读取总质押量
  const totalStaked = useContractRead<bigint>(
    contract,
    'getTotalStaked',
    [],
    {
      chainId,
      formatter: (data) => BigInt(data as string),
    }
  );

  // 读取奖励
  const reward = useContractRead<bigint>(
    contract,
    'getReward',
    [address],
    {
      chainId,
      query: {
        enabled: !!address,
      },
      formatter: (data) => BigInt(data as string),
    }
  );

  // 读取最小质押量
  const minStakeAmount = useContractRead<bigint>(
    contract,
    'minStakeAmount',
    [],
    {
      chainId,
      formatter: (data) => BigInt(data as string),
    }
  );

  // 读取最大质押量
  const maxStakeAmount = useContractRead<bigint>(
    contract,
    'maxStakeAmount',
    [],
    {
      chainId,
      formatter: (data) => BigInt(data as string),
    }
  );

  // 读取质押者数量
  const stakerCount = useContractRead<bigint>(
    contract,
    'stakerCount',
    [],
    {
      chainId,
      formatter: (data) => BigInt(data as string),
    }
  );

  // 检查是否是质押者
  const isStaker = useContractRead<boolean>(
    contract,
    'isStaker',
    [address],
    {
      chainId,
      query: {
        enabled: !!address,
      },
    }
  );

  // 质押函数
  const stake = useContractWrite(
    contract,
    'stake',
    [],
    undefined // value 将在调用时设置
  );

  // 取消质押函数
  const unstake = useContractWrite(
    contract,
    'unstake'
  );

  // 领取奖励函数
  const claimReward = useContractWrite(
    contract,
    'claimReward'
  );

  // 重新质押函数
  const restake = useContractWrite(
    contract,
    'restake'
  );

  return {
    // 读取状态
    stakeBalance,
    totalStaked,
    reward,
    minStakeAmount,
    maxStakeAmount,
    stakerCount,
    isStaker,
    
    // 写入函数
    stake,
    unstake,
    claimReward,
    restake,
    
    // 账户信息
    address,
  };
}