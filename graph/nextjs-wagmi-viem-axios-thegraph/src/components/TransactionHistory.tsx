"use client";

import { useAccount } from "wagmi";
import { useGraphData } from "../hooks/useGraphData";

export const TransactionHistory: React.FC = () => {
  const { address, chainId } = useAccount();
  const { transfers, loading, error } = useGraphData(address, chainId);

  if (!address) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        连接钱包查看交易历史
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        加载交易历史中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-red-600">
        错误: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">最近交易</h2>
      {transfers.length === 0 ? (
        <p className="text-gray-500">未找到交易记录</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transfers.map(transfer => (
            <div
              key={transfer.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="text-sm text-gray-600 mb-1">
                交易哈希: {transfer.transactionHash.slice(0, 10)}...
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="font-medium">从:</span>{" "}
                  {transfer.from.slice(0, 8)}...
                </div>
                <div>
                  <span className="font-medium">到:</span>{" "}
                  {transfer.to.slice(0, 8)}...
                </div>
                <div>
                  <span className="font-medium">金额:</span>{" "}
                  {(Number(transfer.value) / 1e18).toFixed(4)}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(parseInt(transfer.timestamp) * 1000).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
