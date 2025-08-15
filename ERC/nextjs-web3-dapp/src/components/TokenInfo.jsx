'use client';

import {useAccount, useContractRead} from 'wagmi';
import {erc20Abi} from 'viem';

// ERC20 合约地址（部署到 Ganache 的地址）
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "0x8622BBab4157926a0AFd2C2FD83a8a325Bd8Fe5e";
console.log("%c 1 --> Line: 8||TokenInfo.jsx\n TOKEN_ADDRESS: ", "color:#f0f;", TOKEN_ADDRESS);

export default function TokenInfo() {
  const {address, isConnected} = useAccount();

  // 读取合约数据
  const {data: balance} = useContractRead({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!address
  });

  const {data: symbol} = useContractRead({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'symbol'
  });

  const {data: name} = useContractRead({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'name'
  });

  const {data: decimals} = useContractRead({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'decimals'
  });

  // 格式化代币数量
  const formatBalance = (balance, decimals) => {
    if (!balance || decimals === undefined) return '0.00';
    const divisor = 10 ** decimals;
    return (Number(balance) / divisor).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };
  console.log(name, symbol)
  return (
    <div className="space-y-4">
      {name ? (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center">
            <span className="font-bold">{symbol.charAt(0)}</span>
          </div>
          <div>
            <h4 className="font-semibold">{name} ({symbol})</h4>
            <p className="text-sm text-gray-400">ERC20 Token</p>
          </div>
        </div>
      ) : (
        <p>Loading token info...</p>
      )}

      {isConnected ? (
        <div className="mt-4">
          <p className="text-gray-400">Your Balance</p>
          <p className="text-2xl font-bold">
            {formatBalance(balance, decimals)} {symbol}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 italic">Connect wallet to view balance</p>
      )}
    </div>
  );
}