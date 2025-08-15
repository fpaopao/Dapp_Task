"use client";
import {useAccount} from "wagmi";
import ConnectButton from "./components/ConnectButton";
import ReadContract from "./components/ReadContract";

import TokenTransfer from "@/app/components/TokenTransfer";

export default function Home() {

  return (
    <>
      <header className="bg-gradient-to-r from-purple-900 to-purple-700 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Web3 DApp</h1>
          <ConnectButton/>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <ReadContract/>
        -------------------
        <TokenTransfer/>
      </main>
    </>
  )
}