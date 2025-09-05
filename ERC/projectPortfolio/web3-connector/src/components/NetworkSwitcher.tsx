"use client";

import { useWeb3 } from "../hooks/useWeb3";
import Button from "./ui/Button";

export default function NetworkSwitcher() {
  const {
    getChains: chains,
    chain,
    switchChain,
    chainStatus,
    chainSuccess,
  } = useWeb3();

  const switchChainOpe = async (id: number) => {
    if (chain?.id !== id) {
      try {
        const res = await switchChain({ chainId: id });
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">选择网络</p>
      <div className="grid grid-cols-2 gap-2">
        {chains.map((network) => (
          <Button
            key={network.id}
            onClick={() => switchChainOpe(network.id)}
            variant={chain?.id === network.id ? "primary" : "outline"}
            size="sm"
          >
            {network.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
