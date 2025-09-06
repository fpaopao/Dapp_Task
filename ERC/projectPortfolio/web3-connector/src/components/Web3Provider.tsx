"use client";

import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { sepolia, mainnet, polygon, arbitrum, goerli } from "wagmi/chains";
import { metaMask, injected, walletConnect } from "wagmi/connectors";
import { ReactNode } from "react";

export const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "4eee412f87919d54aa6c870ab6eca637";

const queryClient = new QueryClient();

// 配置支持的链
const chains = [sepolia, mainnet, polygon, arbitrum, goerli] as const;

// 创建wagmi配置
export const config = createConfig({
  chains,
  connectors: [injected(), metaMask(), walletConnect({ projectId: projectId })],
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
