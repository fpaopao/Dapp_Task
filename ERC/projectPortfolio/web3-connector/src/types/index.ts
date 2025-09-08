// types/index.ts
export interface WalletConfig {
  id: string;
  name: string;
  icon: string;
  downloadUrl: string;
  isInjected?: boolean; // 是否为注入式钱包（如MetaMask）
  rdns?: string; // EIP-6963 钱包标识
}

export interface DynamicWalletConfig extends WalletConfig {
  isInstalled?: boolean; // 钱包是否已安装，动态判断
}