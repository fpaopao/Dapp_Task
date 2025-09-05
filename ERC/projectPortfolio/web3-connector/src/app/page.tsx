"use client";

import ConnectButton from "@/components/ConnectButton";

// 定义钱包连接器类型
interface WalletConnector {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function Home() {
  // 可用的钱包连接器
  const walletConnectors: WalletConnector[] = [
    {
      id: "metaMaskSDK",
      name: "MetaMask",
      icon: "fab fa-ethereum",
      description: "浏览器扩展钱包",
    },
    {
      id: "coinbaseWallet",
      name: "Coinbase Wallet",
      icon: "fas fa-dollar-sign",
      description: "移动端和扩展钱包",
    },
    {
      id: "walletConnect",
      name: "WalletConnect",
      icon: "fas fa-qrcode",
      description: "二维码连接",
    },
  ];

  const customButton = {
    component: (
      <div className="flex items-center space-x-2 cursor-pointer">
        <span>🦊</span>
        <span>连接我的钱包</span>
      </div>
    ),
    className: "px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600",
    onClick: (openModal) => {
      // 自定义点击逻辑
      alert("点击了自定义按钮");

      // 最后打开模态框
      // openModal();
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Web3 Connector</h1>
        <ConnectButton className="ceshi" walletConnectors={walletConnectors} />
        {/* <ConnectButton className="ceshi" label="链接钱包" showBalance={false}walletConnectors={walletConnectors}/> */}
        {/* <ConnectButton
          walletConnectors={walletConnectors}
          customButton={customButton}
        /> */}
      </div>
    </div>
  );
}
