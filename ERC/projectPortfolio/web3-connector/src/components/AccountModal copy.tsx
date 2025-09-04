'use client';

import { useWeb3 } from '../hooks/useWeb3';
import { useBalance } from '../hooks/useBalance';
import NetworkSwitcher from './NetworkSwitcher';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  console.log("🚀 ~ AccountModal ~ isOpen:", isOpen)
  const { isConnected, address, disconnect } = useWeb3();
  const { balance, symbol } = useBalance();

  // if (!isConnected) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account">
      <div className="space-y-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">Connected with</p>
          <p className="font-medium truncate">{address}</p>
        </div>

        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">Balance</p>
          <p className="font-medium">
            {balance} {symbol}
          </p>
        </div>

        <NetworkSwitcher />

        <Button
          onClick={() => {
            disconnect();
            onClose();
          }}
          variant="danger"
          fullWidth
        >
          Disconnect
        </Button>
      </div>
    </Modal>
  );
}