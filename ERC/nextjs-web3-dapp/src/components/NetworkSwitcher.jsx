'use client';

import {useSwitchChain, useChainId} from 'wagmi';

export default function NetworkSwitcher() {
  // 获取链id
  const chainId = useChainId();
  // 获取所有链路，切换链路
  const {chains, switchChain} = useSwitchChain();
  console.log("%c 1 --> Line: 10||NetworkSwitcher.jsx\n chains: ", "color:#f0f;", chains);
  // 根据链路id=>链路名称
  const chainName = chains.find(c => c.id === chainId)
  console.log("%c 1 --> Line: 10||NetworkSwitcher.jsx\n chainName: ", "color:#f0f;", chainName);

  const ganache = {
    id: 1337
  }

  // 自动切换到 Ganache（开发环境）
  if (chainId != ganache.id) {
    return (
      <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg mb-4">
        <div className="flex items-center">
          <div className="mr-3 text-xl">⚠️</div>
          <div>
            <p className="text-yellow-400">
              Please switch to Ganache network for contract interactions
            </p>
            <button
              onClick={() => switchChain({chainId: ganache.id})}
              className="mt-2 px-4 py-2 bg-yellow-700 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Switch to Ganache
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium">Current Network: {chainId}---{chainName.name}</h3>
      <div className="flex flex-wrap gap-2">
        {chains.map((chainItem) => (
          <button
            key={chainItem.id}
            onClick={() => switchChain({chainId: chainItem.id})}
            className={`px-4 py-2 rounded-lg transition-colors ${
              chainItem.id === chainId
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {chainItem.name}
          </button>
        ))}
      </div>
    </div>
  );
}