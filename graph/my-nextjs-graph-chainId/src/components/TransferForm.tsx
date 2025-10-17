"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { CONFIG } from "../lib/config";
import ERC20_ABI from "../contracts/abis/ERC20.json";

export const TransferForm: React.FC = () => {
  const { address, isConnected, chainId } = useAccount();
  const currentChainConfig = CONFIG.getCurrentChainConfig(chainId);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  // 配置转账写操作 :cite[5]
  const {
    data: hash,
    writeContract,
    isPending: isWriting,
    error: writeError
  } = useWriteContract();

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !toAddress ||
      !amount ||
      !writeContract ||
      !currentChainConfig.contractAddress
    )
      return;

    try {
      // 使用精确的金额计算（假设代币decimals为18）
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));

      writeContract({
        address: currentChainConfig.contractAddress,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [toAddress as `0x${string}`, amountInWei]
      });
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  const isLoading = isWriting || isConfirming;

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p>请连接钱包进行转账</p>
      </div>
    );
  }

  if (!currentChainConfig.contractAddress) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p>当前网络不支持该代币</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">代币转账</h2>

      {writeError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          错误: {writeError.message}
        </div>
      )}

      {isConfirmed && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ 转账成功!
          {hash && (
            <div className="mt-1">
              <a
                href={`https://etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                在区块浏览器中查看
              </a>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="toAddress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            接收地址:
          </label>
          <input
            type="text"
            id="toAddress"
            value={toAddress}
            onChange={e => setToAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            pattern="^0x[a-fA-F0-9]{40}$"
            title="请输入有效的以太坊地址"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            金额:
          </label>
          <input
            type="number"
            id="amount"
            step="0.000001"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isWriting
            ? "在钱包中确认..."
            : isConfirming
            ? "处理交易中..."
            : "转账"}
        </button>

        {hash && (
          <div className="text-center">
            <a
              href={`https://etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              在区块浏览器中查看交易
            </a>
          </div>
        )}
      </div>
    </form>
  );
};
