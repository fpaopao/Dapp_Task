"use client";

import { useAccount } from "wagmi";
import { WalletConnect } from "../components/WalletConnect";
import { Balance } from "../components/Balance";
import { TransferForm } from "../components/TransferForm";
import { TransactionHistory } from "../components/TransactionHistory";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            ERC20 DApp with The Graph
          </h1>
          <p className="mt-2 text-gray-600">
            使用 Next.js, Wagmi, Viem 和 The Graph 构建的去中心化应用
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧栏 - 钱包连接 */}
          <div className="lg:col-span-1">
            <WalletConnect />
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-2">
            {isConnected ? (
              <div className="space-y-8">
                <Balance />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <TransferForm />
                  <TransactionHistory />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">欢迎使用 ERC20 DApp</h2>
                <p className="text-gray-600 mb-6">
                  请先连接您的钱包，然后您可以查看余额、转账代币和查看交易历史。
                </p>
                <div className="text-sm text-gray-500">
                  <p>支持的网络: 以太坊主网, Sepolia测试网</p>
                  <p>支持的钱包: MetaMask, WalletConnect, 注入式钱包</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
