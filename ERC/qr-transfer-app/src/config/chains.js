import { sepolia } from 'viem/chains';

// 定义本地 Ganache 链
export const ganacheChain = {
  id: 1337,
  name: 'Ganache',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:5777']
    },
  },
  blockExplorers: {
    default: {
      name: 'Ganache',
      url: 'http://localhost:5777'
    },
  },
};

// 定义 Sepolia 测试网
export const sepoliaChain = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID']
    },
  },
};

// 支持的链
export const supportedChains = [ganacheChain, sepoliaChain];