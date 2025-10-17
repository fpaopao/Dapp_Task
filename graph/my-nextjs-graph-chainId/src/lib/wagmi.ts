import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { CONFIG } from "./config";

// 根据环境变量选择支持的链
const getSupportedChains = () => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (chainId === "1") return [mainnet];
  if (chainId === "11155111") return [sepolia];
  return [mainnet, sepolia]; // 默认支持主网和Sepolia
};

// 创建传输配置
const getTransports = () => {
  const transports: Record<number, ReturnType<typeof http>> = {};
  const chains = getSupportedChains();

  chains.forEach(chain => {
    transports[chain.id] = http(
      CONFIG.RPC_URL[chain.id as keyof typeof CONFIG.RPC_URL],
      {
        batch: {
          wait: 100 // 批量请求等待时间(ms)
        },
        retryCount: 3 // 重试次数
      }
    );
  });

  return transports;
};

// 创建连接器配置
const getConnectors = () => {
  const connectors = [injected(), metaMask()];

  // 如果配置了WalletConnect项目ID，则添加WalletConnect连接器
  if (CONFIG.WALLETCONNECT_PROJECT_ID) {
    connectors.push(
      walletConnect({
        projectId: CONFIG.WALLETCONNECT_PROJECT_ID,
        showQrModal: true
      })
    );
  }

  return connectors;
};

// 创建 Wagmi 配置 :cite[2]:cite[6]
export const config = createConfig({
  chains: getSupportedChains(),
  transports: getTransports(),
  connectors: getConnectors(),
  ssr: true // 启用 SSR 支持
});

// 导出链信息供其他组件使用
export const supportedChains = getSupportedChains();
