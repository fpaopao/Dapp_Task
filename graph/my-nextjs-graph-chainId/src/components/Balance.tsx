"use client";

import { useAccount, useBalance, useReadContract } from "wagmi";
import { CONFIG } from "../lib/config";
import ERC20_ABI from "../contracts/abis/ERC20.json";

export const Balance: React.FC = () => {
  const { address, isConnected, chainId } = useAccount();
  const currentChainConfig = CONFIG.getCurrentChainConfig(chainId);

  // 读取原生币余额 :cite[1]
  const { data: nativeBalance, isLoading: nativeLoading } = useBalance({
    address,
    chainId
  });

  // 读取ERC20代币余额
  const { data: tokenBalance, isLoading: tokenLoading } = useReadContract({
    address: currentChainConfig.contractAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: !!address && !!currentChainConfig.contractAddress
    }
  });

  // 读取代币符号
  const { data: tokenSymbol } = useReadContract({
    address: currentChainConfig.contractAddress,
    abi: ERC20_ABI,
    functionName: "symbol",
    query: {
      enabled: !!currentChainConfig.contractAddress
    }
  });

  // 读取代币小数位
  const { data: tokenDecimals } = useReadContract({
    address: currentChainConfig.contractAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: {
      enabled: !!currentChainConfig.contractAddress
    }
  });

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p>请连接钱包查看余额</p>
      </div>
    );
  }

  const formatTokenBalance = (balance: bigint, decimals: number = 18) => {
    const divisor = BigInt(10) ** BigInt(decimals);
    const whole = balance / divisor;
    const fractional = balance % divisor;
    return `${whole}.${fractional
      .toString()
      .padStart(decimals, "0")
      .slice(0, 4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">余额信息</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <strong className="text-gray-700 block">原生代币余额</strong>
            <span className="text-sm text-gray-500">
              {chainId === 1
                ? "ETH"
                : chainId === 11155111
                ? "Sepolia ETH"
                : "Native Token"}
            </span>
          </div>
          <span className="text-lg font-semibold">
            {nativeLoading
              ? "加载中..."
              : nativeBalance
              ? `${parseFloat(nativeBalance.formatted).toFixed(6)}`
              : "0"}
          </span>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <strong className="text-gray-700 block">代币余额</strong>
            <span className="text-sm text-gray-500">
              {tokenSymbol || "ERC20 Token"}
            </span>
          </div>
          <span className="text-lg font-semibold">
            {tokenLoading
              ? "加载中..."
              : tokenBalance && tokenDecimals
              ? `${formatTokenBalance(
                  tokenBalance as bigint,
                  Number(tokenDecimals)
                )} ${tokenSymbol}`
              : "0"}
          </span>
        </div>
      </div>
    </div>
  );
};
