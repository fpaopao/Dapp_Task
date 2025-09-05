"use client";

import { useWeb3 } from "@/hooks/useWeb3";
import { useEffect, useState } from "react";
import AccountModal from "./AccountModal";
import Button from "./ui/Button";

export interface CustomButtonProps {
  component?: React.ReactNode;
  className?: string;
  onClick?: (openModal: () => void) => void; // 添加自定义点击事件
}

export interface ConnectButtonProps {
  label?: string;
  className?: string;
  showBalance?: boolean;
  walletConnectors: array;
  customButton?: CustomButtonProps;
}

export default function ConnectButton({
  label = "Connect Wallet",
  className = "",
  showBalance = true,
  walletConnectors = [],
  customButton,
}: ConnectButtonProps) {
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

  // 自定义按钮
  if (customButton?.component) {
    const handleClick = () => {
      if (customButton.onClick) {
        // 传入打开模态框的函数作为参数
        customButton.onClick(() => setIsModalOpen(true));
      } else {
        // 如果没有自定义点击事件，直接打开模态框
        setIsModalOpen(true);
      }
    };
    return (
      <>
        <div className={customButton.className} onClick={handleClick}>
          {customButton.component}
        </div>

        <AccountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          walletConnectors={walletConnectors}
        />
      </>
    );
  }
  // 默认按钮
  return (
    <>
      <Button
        className={className}
        onClick={() => setIsModalOpen(true)}
        variant={variant}
      >
        {mounted && isConnected ? (
          <>
            {showBalance && (
              <div className="flex items-center">
                <p>
                  {typeof balance == "undefined"
                    ? 0
                    : parseFloat(balance?.formatted).toFixed(4)}
                  ETH
                </p>
              </div>
            )}
            <div className="flex items-center">
              <p>{truncatedAddress}</p>
            </div>
          </>
        ) : (
          <span className="flex items-center">
            <i className="fas fa-plug mr-2"></i>
            {label}
          </span>
        )}
      </Button>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletConnectors={walletConnectors}
      />
    </>
  );
}
