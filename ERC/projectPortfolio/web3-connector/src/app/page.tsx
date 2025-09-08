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
        {/* <h1 className="text-2xl font-bold mb-6 text-center">Web3 Connector</h1> */}
        <ConnectButton className="ceshi" />
        {/* <ConnectButton className="ceshi" label="链接钱包" showBalance={false}/> */}
        {/* <ConnectButton
          customButton={customButton}
        /> */}
      </div>
    </div>
  );
}
