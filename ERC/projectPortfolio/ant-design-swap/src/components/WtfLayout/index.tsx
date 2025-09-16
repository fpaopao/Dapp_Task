// 整体布局
import React from "react";
import Header from "./Header";
import {
  MetaMask,
  OkxWallet,
  TokenPocket,
  WagmiWeb3ConfigProvider,
  WalletConnect,
  Hardhat,
  Mainnet,
  Sepolia
} from "@ant-design/web3-wagmi";

interface WtfLayoutProps {
  children: React.ReactNode;
}

const WtfLayout: React.FC<WtfLayoutProps> = ({ children }) => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      chains={[Sepolia,Mainnet, Hardhat]}
      ens
      wallets={[
        MetaMask(),
        WalletConnect(),
        TokenPocket({
          group: "Popular",
        }),
        OkxWallet({
          group: "Popular",
        }),
      ]}
      walletConnect={{
        projectId: "4eee412f87919d54aa6c870ab6eca637",
      }}
    >
      <Header />
      {children}
    </WagmiWeb3ConfigProvider>
  );
};

export default WtfLayout;
