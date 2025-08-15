"use client";
import { useAccount } from "wagmi";
import ConnectButton from "@/components/ConnectButton";
import TokenInfo from "@/components/TokenInfo";
import TransferForm from "@/components/TransferForm";
import NetworkSwitcher from '@/components/NetworkSwitcher';
// import WalletConnectModal from "@/components/WalletConnectModal";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-gradient-to-r from-purple-900 to-purple-700 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Web3 DApp</h1>
          <ConnectButton />
        </div>
      </header>
      {/* 主内容区 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">ERC20 Token Dashboard</h2>
            <p className="text-gray-400">
              Connect your wallet to manage your tokens
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧面板 */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Network Settings</h3>
                 <NetworkSwitcher />
              </div>
---------------------------------------------------------
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">
                  Token Information
                </h3>
                <TokenInfo />
              </div>
            </div>
----------------------------------------------------------
            {/* 右侧面板 */}
            <div className="space-y-6">
              {isConnected ? (
                <>
                  <div className="card">
                    <h3 className="text-xl font-semibold mb-4">
                      Transfer Tokens
                    </h3>
                    <TransferForm />
                  </div>

                   {/*<WalletConnectModal />*/}
                </>
              ) : (
                <>
                  <div className="card text-center py-10">
                    <h3 className="text-xl font-semibold mb-4">
                      Connect Your Wallet
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Please connect your wallet to transfer tokens
                    </p>
                    <ConnectButton />
                  </div>

                   {/*<WalletConnectModal />*/}
                </>
              )}
              ----------------------------------------------------------

              <div className="card">
                <p>Wagmi+viem+rainbowKit+ERC20</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
