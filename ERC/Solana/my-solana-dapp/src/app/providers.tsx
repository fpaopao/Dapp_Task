// 在 app/providers.tsx 或类似组件中
"use client"; // 必须在客户端组件中使用
import {
  SolanaWeb3ConfigProvider,
  PhantomWallet
} from "@ant-design/web3-solana";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // 配置网络（开发时通常使用Devnet）
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // 配置支持的钱包
  const wallets = useMemo(() => [new PhantomWallet()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <SolanaWeb3ConfigProvider wallets={wallets}>
          {children}
        </SolanaWeb3ConfigProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
