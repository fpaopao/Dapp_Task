"use client";

import { useWeb3 } from "@/hooks/useWeb3";
import { useEffect, useState } from "react";
import AccountModal from "./AccountModal";
import Button from "./ui/Button";

export interface ConnectButtonProps {
  className?: string;
}

export default function ConnectButton({ className = "" }: ConnectButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, address, balance } = useWeb3();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const truncatedAddress = address
    ? `${address.slice(0, 10)}...${address.slice(-4)}`
    : "";

  const variant = !mounted ? "primary" : isConnected ? "secondary" : "primary";

  return (
    <>
      <Button
        className={className}
        onClick={() => setIsModalOpen(true)}
        variant={variant}
      >
        {mounted && isConnected ? (
          <>
            <div className="flex items-center">
              <p>
                {typeof balance == "undefined"
                  ? 0
                  : parseFloat(balance?.formatted).toFixed(4)}
                ETH
              </p>
            </div>
            <div className="flex items-center">
              <p>{truncatedAddress}</p>
            </div>
          </>
        ) : (
          <span className="flex items-center">
            <i className="fas fa-plug mr-2"></i>
            连接钱包
          </span>
        )}
      </Button>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
