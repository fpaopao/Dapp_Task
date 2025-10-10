"use client";
import { ConnectButton } from "@ant-design/web3";

export default function Home() {
  return (
    <main className="p-24">
      <h1>我的Solana dApp</h1>
      <ConnectButton />
    </main>
  );
}
