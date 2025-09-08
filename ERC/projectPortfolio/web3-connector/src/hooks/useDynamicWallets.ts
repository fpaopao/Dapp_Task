import { useState, useEffect } from "react";
import { useConnect } from "wagmi";
import { WalletConfig, DynamicWalletConfig } from "@/types";
import { getWalletConfigs } from "@/config/wallets";
import { detectWallet, getDownloadUrl } from "@/config/walletUtils";

export const useDynamicWallets = () => {
  const [wallets, setWallets] = useState<DynamicWalletConfig[]>([]);
  const { connect, connectors, error } = useConnect();

  // 加载并检测钱包
  const loadWallets = () => {
    const configs = getWalletConfigs();
    const dynamicWallets: DynamicWalletConfig[] = configs.map((config) => ({
      ...config,
      isInstalled: detectWallet(config),
    }));
    setWallets(dynamicWallets);
    console.log("🚀 ~ loadWallets ~ dynamicWallets:", dynamicWallets);
  };
  useEffect(() => {
    loadWallets();
  }, []);

  // 连接钱包
  const connectWallet = (wallet: DynamicWalletConfig) => {
    if (!wallet.isInstalled) {
      alert("钱包未安装，正在跳转到下载页面...");
      // 跳转到下载页面
      window.open(getDownloadUrl(wallet), "_blank");
      return;
    }

    // 找到对应的连接器并连接
    const connector = connectors.find((c) => c.id.includes(wallet.id));
    console.log("🚀 ~ connectWallet ~ connectors:", connectors);
    if (connector) {
      connect({ connector });
    }
  };

  return {
    wallets,
    connectWallet,
    refreshWallets: loadWallets,
    error,
  };
};
