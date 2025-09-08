"use client";

import { createConfig, WagmiProvider, configureChains, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { http } from "viem";
import { sepolia, mainnet, polygon, arbitrum, goerli } from "wagmi/chains";
import { metaMask, injected, walletConnect } from "wagmi/connectors";
import { ReactNode } from "react";
import { publicProvider } from "wagmi/providers/public";
import { WalletConfig } from "@/types";

import { getWalletConfigs } from "@/config/wallets";
export const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "4eee412f87919d54aa6c870ab6eca637";

const queryClient = new QueryClient();

// 配置支持的链
const chains = [sepolia, mainnet, polygon, arbitrum, goerli] as const;

const walletConfigs = getWalletConfigs();
// 动态生成连接器
const getConnectors = (wallets: WalletConfig[]) => {
  const connectors = [];

  const findWalletProvider = (wallet: WalletConfig) => {
    if (typeof window === "undefined") return undefined;

    // 检查特定钱包的全局对象
    if (wallet.id === "okxWallet" && (window as any).okxwallet) {
      return (window as any).okxwallet;
    }
    if (
      wallet.id === "coinbaseWallet" &&
      (window as any).coinbaseWalletExtension
    ) {
      return (window as any).coinbaseWalletExtension;
    }
    if (wallet.id === "trustWallet" && (window as any).trustwallet) {
      return (window as any).trustwallet;
    }

    const eth = window.ethereum as any;
    if (!eth) return undefined;


    // 检查 providers 数组
    if (eth?.providers?.length > 0) {
      const provider = eth.providers.find((p: any) => {
        switch (wallet.id) {
          case "metaMask":
            return p.isMetaMask && !p.isTrust && !p.isCoinbaseWallet;
          case "coinbaseWallet":
            return p.isCoinbaseWallet || p.isWalletLink;
          case "okxWallet":
            return p.isOKX || p.isOKXWallet || p.isOKExWallet;
          case "trustWallet":
            return (
              p.isTrust ||
              p.isTrustWallet ||
              // Trust Wallet 可能使用的其他标识
              p.providerMap?.["trust"] ||
              p.providers?.some((sub: any) => sub.isTrust || sub.isTrustWallet)
            );
          default:
            return false;
        }
      });
      if (provider) return provider;
    }

    // 检查单一 provider
    switch (wallet.id) {
      case "metaMask":
        return eth.isMetaMask && !eth.isTrust && !eth.isCoinbaseWallet
          ? eth
          : undefined;
      case "coinbaseWallet":
        return eth.isCoinbaseWallet || eth.isWalletLink ? eth : undefined;
      case "okxWallet":
        return eth.isOKX || eth.isOKXWallet || eth.isOKExWallet
          ? eth
          : undefined;
      case "trustWallet":
        return eth.isTrust || eth.isTrustWallet ? eth : undefined;
      default:
        return undefined;
    }
  };

  for (const wallet of wallets) {
    if (wallet.isInjected) {
      const provider = findWalletProvider(wallet);
      connectors.push(
        injected({
          target: {
            id: wallet.id,
            name: wallet.name,
            provider,
          },
        })
      );
    } else if (wallet.id === "walletConnect") {
      // WalletConnect
      connectors.push(
        walletConnect({
          projectId,
          showQrModal: true,
        })
      );
    }
  }

  return connectors;
};
// 创建wagmi配置
export const config = createConfig({
  chains,
  connectors: getConnectors(walletConfigs),
  transports: {
    [sepolia.id]: http("https://eth-sepolia.api.onfinality.io/public"),
    [mainnet.id]: http("https://mainnet.rpc.url"),
    [polygon.id]: http("https://polygon.rpc.url"),
    [arbitrum.id]: http(),
    [goerli.id]: http(),
  },
});

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
