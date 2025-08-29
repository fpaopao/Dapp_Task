import { useReadContract, useAccount } from 'wagmi';
import { useCallback, useEffect, useMemo } from 'react';
import { ContractReadResult, ReadContractConfig, ReadOptions } from '../contracts/types';
import { handleContractError } from '../utils/errorHandler';

export const useContractRead = <T = any>(
  config: ReadContractConfig,
  options: ReadOptions = {}
): ContractReadResult<T> => {
  const { isConnected, address } = useAccount();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    status,
  } = useReadContract({
    address: config.address,
    abi: config.abi,
    functionName: config.functionName,
    args: config.args,
    query: {
      enabled: options.enabled !== false && isConnected,
      cacheTime: options.cacheTime || 5 * 60 * 1000, // 默认缓存5分钟
      staleTime: options.staleTime || 30 * 1000, // 默认30秒后重新获取
    },
  });

  // 自动监听区块变化
  useEffect(() => {
    if (options.watch && isConnected) {
      const interval = setInterval(() => {
        refetch();
      }, 15000); // 每15秒刷新一次

      return () => clearInterval(interval);
    }
  }, [options.watch, isConnected, refetch]);

  const formattedError = useMemo(() => {
    if (error) {
      return handleContractError(error);
    }
    return null;
  }, [error]);

  const formattedStatus = useMemo(() => {
    if (isLoading) return 'loading';
    if (isError) return 'error';
    if (data !== undefined) return 'success';
    return 'idle';
  }, [isLoading, isError, data]);

  return {
    data: data as T,
    isLoading,
    isError,
    error: formattedError,
    refetch: useCallback(() => {
      if (isConnected) {
        refetch();
      }
    }, [isConnected, refetch]),
    status: formattedStatus,
  };
};

// 便捷 Hook：带自动重试的读取
export const useContractReadWithRetry = <T = any>(
  config: ReadContractConfig,
  options: ReadOptions & { retryCount?: number; retryDelay?: number } = {}
): ContractReadResult<T> => {
  const { retryCount = 3, retryDelay = 1000, ...readOptions } = options;
  const [retry, setRetry] = useState(0);

  const result = useContractRead<T>(config, {
    ...readOptions,
    enabled: readOptions.enabled !== false && retry < retryCount,
  });

  useEffect(() => {
    if (result.isError && retry < retryCount) {
      const timer = setTimeout(() => {
        setRetry(prev => prev + 1);
        result.refetch();
      }, retryDelay);

      return () => clearTimeout(timer);
    }
  }, [result.isError, retry, retryCount, retryDelay, result.refetch]);

  return result;
};