"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import NetworkSwitcher from "./NetworkSwitcher";
import Button from "./ui/Button";
import Modal from "./ui/Modal";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletConnectors: Array<any>;
}

export default function AccountModal({ isOpen, onClose ,walletConnectors}: AccountModalProps) {
  const { isConnected, address, connect, connectors, disconnect, balance } =
    useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<any>(null);


  // 处理钱包连接
  const handleConnect = async (connector: any) => {
    setIsConnecting(true);
    setSelectedConnector(connector);

    try {
      await connect({ connector });
      setIsConnecting(false);
    } catch (error) {
      console.error("连接失败:", error);
      setIsConnecting(false);
    }
  };

  // 处理断开连接
  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  // 重置连接状态当modal关闭时
  useEffect(() => {
    if (!isOpen) {
      setIsConnecting(false);
      setSelectedConnector(null);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isConnected ? "账户信息" : "连接钱包"}
    >
      {!isConnected ? (
        // 未连接状态 - 显示钱包连接器列表
        <div className="space-y-4">
          <div className="space-y-3">
            {connectors.map((connector) => {
              const walletInfo = walletConnectors.find(
                (w) => w.id === connector.id
              );
              if (!walletInfo) return null;
              const isConnectingToThis =
                isConnecting && selectedConnector?.id === connector.id;
              return (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  disabled={isConnecting}
                  className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 mr-4">
                    <i className={walletInfo.icon}></i>
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">{walletInfo.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {walletInfo.description}
                    </div>
                  </div>
                  {isConnectingToThis && (
                    <div className="ml-2">
                      <i className="fas fa-spinner fa-spin text-blue-500"></i>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // 已连接状态 - 显示账户信息
        <div className="space-y-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">账户地址</p>
            <p className="font-mono text-sm truncate">{address}</p>
          </div>

          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">余额</p>
            <p className="font-medium">
              {typeof balance == "undefined"
                ? 0
                : parseFloat(balance?.formatted).toFixed(4)}
              ETH
            </p>
          </div>

          <NetworkSwitcher />

          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button onClick={handleDisconnect} variant="danger" fullWidth>
              断开连接
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
