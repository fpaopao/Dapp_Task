'use client';
import { useAccount } from 'wagmi';
import { formatAddress } from '@/lib/utils';

export default function WalletStatus() {
  const { address, chain, isConnected } = useAccount();
  console.log("%c 1 --> Line: 7||WalletStatus.jsx\n useAccount(): ","color:#f0f;", useAccount());

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">Wallet not connected</p>
        <p className="text-yellow-600 text-sm mt-1">
          Connect your wallet to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-green-800 font-medium">Connected Wallet</p>
          <p className="text-green-600 text-sm mt-1">{formatAddress(address)}</p>
        </div>
        <div className="text-right">
          <p className="text-green-800 font-medium">Network</p>
          <p className="text-green-600 text-sm mt-1">{chain?.name}</p>
        </div>
      </div>
    </div>
  );
}
