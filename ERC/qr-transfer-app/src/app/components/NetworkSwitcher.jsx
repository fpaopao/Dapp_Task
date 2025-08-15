'use client';
import { useSwitchChain } from 'wagmi';
import { supportedChains } from '@/config/chains';
import { getChainName } from '@/lib/utils';

export default function NetworkSwitcher() {
  const { chains, switchChain } = useSwitchChain();

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Switch Network</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {supportedChains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <div className="mr-2 w-5 h-5 bg-gray-600 rounded-full"></div>
            {getChainName(chain.id)}
          </button>
        ))}
      </div>
    </div>
  );
}