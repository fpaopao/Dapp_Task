import { WalletConfig } from "@/types";

export const defaultWallets: WalletConfig[] = [
  {
    "id": "metaMask",
    "name": "MetaMask",
    "icon": "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png",
    "downloadUrl":"https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
    "isInjected": true,
    "rdns": "io.metamask"
  },
    {
    "id": "okxWallet",
    "name": "okxWallet",
    "icon": "https://cdn.iconscout.com/icon/free/png-256/walletconnect-2752056-2285001.png",
    "downloadUrl": "https://walletconnect.com/",
    "isInjected": true,
    "rdns": "com.okex.wallet"
  },
  {
    "id": "coinbaseWallet",
    "name": "Coinbase Wallet",
    "icon": "https://cdn.iconscout.com/icon/free/png-256/coinbase-4-283159.png",
    "downloadUrl": "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
    "isInjected": true,
    "rdns": "com.coinbase.wallet"
  },
  {
    "id": "walletConnect",
    "name": "WalletConnect",
    "icon": "https://cdn.iconscout.com/icon/free/png-256/walletconnect-2752056-2285001.png",
    "downloadUrl":"https://walletconnect.com/",
    "isInjected": false,
    "rdns": "org.walletconnect"
  }];

// 从localStorage加载自定义钱包配置
/**custom-wallets
 * [
 {
    "id": "trustWallet",
    "name": "Trust Wallet",
    "icon": "https://cdn.iconscout.com/icon/free/png-256/trust-wallet-806488.png",
    "downloadUrl":"https://trustwallet.com/",
    "isInjected": true,
    "rdns": "com.walletconnect"
  }
]
 */
export const getWalletConfigs = (): WalletConfig[] => {
  if (typeof window === "undefined") return defaultWallets;
  try {
    const customWallets = localStorage.getItem("custom-wallets");
    return customWallets 
      ? [...defaultWallets, ...JSON.parse(customWallets)] 
      : defaultWallets;
  } catch {
    return defaultWallets;
  }
};
