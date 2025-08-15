import { createConfig, http } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';
import { supportedChains } from '@/config/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// 创建 Wagmi 配置
export const config = createConfig({
  chains: supportedChains,
  transports: {
    [supportedChains[0].id]: http(), // Ganache
    [supportedChains[1].id]: http(), // Sepolia
  },
  connectors: [
    walletConnect({
      projectId,
      options: {
        showQrModal: false,
        metadata: {
          name: 'QR Transfer App',
          description: 'Scan to login and transfer tokens',
          url: 'https://qr-transfer-app.vercel.app',
          icons: ['https://qr-transfer-app.vercel.app/favicon.ico'],
        }
      }
    })
  ]
});

// 获取公共客户端
export const getPublicClient = (chainId) => {
  const chain = supportedChains.find(c => c.id === chainId) || supportedChains[0];
  return {
    chain,
    transport: http(chain.rpcUrls.default.http[0])
  };
};

// 获取钱包客户端
export const getWalletClient = (chainId, account) => {
  const chain = supportedChains.find(c => c.id === chainId) || supportedChains[0];
  return {
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
    account
  };
};