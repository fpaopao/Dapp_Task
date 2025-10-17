"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { supportedChains } from "../lib/wagmi";

export const WalletConnect: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">连接钱包</h2>
        <div className="space-y-3">
          {connectors.map(connector => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connector.name}
              {!connector.ready && " (不支持)"}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">钱包信息</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">地址:</span>
          <span className="font-mono">{formatAddress(address!)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">网络:</span>
          <span>{chain?.name || "未知网络"}</span>
        </div>

        {/* 网络切换 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            切换网络:
          </label>
          <select
            value={chain?.id || 1}
            onChange={e => switchChain({ chainId: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {supportedChains.map(chain => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => disconnect()}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-4"
        >
          断开连接
        </button>
      </div>
    </div>
  );
};
