import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem'

// 使用defineChain定义Ganache链
export const ganache = defineChain({
  id: 1337, // Ganache默认链ID
  name: 'Ganache',
  network: 'ganache',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:5777'], // 根据你的Ganache配置调整端口
    },
    public: {
      http: ['http://127.0.0.1:5777']
    },
  },
})

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID; // WalletConnect项目ID

// RainbowKit
export const config = getDefaultConfig({
  appName: 'myDapp',
  projectId,
  chains: [ganache, mainnet, sepolia], // 支持Ganache+主网+测试网
  ssr: true // 启用SSR
});
