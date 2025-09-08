import { WalletConfig } from "@/types";

// 检测钱包是否已安装
export const detectWallet = (wallet: WalletConfig): boolean => {
  if (wallet.id === "walletConnect") return true; // WalletConnect 不需要安装
  if (typeof window === "undefined") return false;

  // 检查特定的全局对象
  if (wallet.id === "okxWallet" && (window as any).okxwallet) {
    return true;
  }
  if (wallet.id === "trustWallet" && (window as any).trustwallet) {
    return true;
  }
  if (
    wallet.id === "coinbaseWallet" &&
    (window as any).coinbaseWalletExtension
  ) {
    return true;
  }

  if (wallet.isInjected) {
    if (!window.ethereum) return false;
    const eth = window.ethereum as any;

    // 检查 providers 数组
    if (eth.providers?.length > 0) {
      return eth.providers.some((p: any) => {
        switch (wallet.id) {
          case "metaMask":
            return p.isMetaMask && !p.isTrust && !p.isCoinbaseWallet;
          case "coinbaseWallet":
            return p.isCoinbaseWallet || p.isWalletLink;
          case "okxWallet":
            return p.isOKX || p.isOKXWallet || p.isOKExWallet;
          case "trustWallet":
            return p.isTrust || p.isTrustWallet || p.providerMap?.["trust"];
          default:
            return false;
        }
      });
    }

    // 检查单一 provider
    switch (wallet.id) {
      case "metaMask":
        return !!eth.isMetaMask && !eth.isTrust && !eth.isCoinbaseWallet;
      case "coinbaseWallet":
        return !!(
          eth.isCoinbaseWallet ||
          eth.isWalletLink ||
          window.coinbaseWalletExtension?.isCoinbaseWallet
        );
      case "okxWallet":
        return !!(eth.isOKX || eth.isOKXWallet || eth.isOKExWallet);
      case "trustWallet":
        return !!(eth.isTrust || eth.isTrustWallet);
      default:
        return false;
    }
  }

  return false;
};

// 下载链接
export const getDownloadUrl = (wallet: WalletConfig): string => {
  return wallet.downloadUrl;
};
