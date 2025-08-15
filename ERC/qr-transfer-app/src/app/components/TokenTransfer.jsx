'use client';
import { useState, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { TokenContract } from '@/contracts/tokenContract';
import { createWalletClient, custom } from 'viem';
import { formatAddress, formatBalance } from '@/lib/utils';
import { FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';
import { supportedChains } from '@/config/chains';

export default function TokenTransfer() {
  const [amount, setAmount] = useState('1');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [balance, setBalance] = useState('0');
  const [transferStatus, setTransferStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Input, 2: Confirm, 3: Result
  const [chainId, setChainId] = useState(1337); // Default to Ganache

  const { address } = useAccount();
  const publicClient = usePublicClient();

  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;

  // 创建钱包客户端
  const walletClient = createWalletClient({
    chain: supportedChains.find(c => c.id === chainId),
    transport: custom(window.ethereum)
  });

  // 创建代币合约实例
  const tokenContract = new TokenContract(
    tokenAddress,
    chainId,
    walletClient
  );

  // 获取代币信息和余额
  const fetchTokenData = async () => {
    try {
      const info = await tokenContract.getInfo();
      const balance = await tokenContract.getBalance(address);

      setTokenInfo(info);
      setBalance(balance);
    } catch (error) {
      console.error('Failed to fetch token data:', error);
      setTransferStatus(`Error: ${error.shortMessage || error.message}`);
    }
  };

  // 执行代币转账
  const executeTokenTransfer = async () => {
    if (!address || !tokenInfo || !amount) {
      setTransferStatus('Missing required information');
      return;
    }

    try {
      setIsLoading(true);
      setTransferStatus('Processing transaction...');

      const hash = await tokenContract.transfer(
        address,
        amount,
        tokenInfo.decimals
      );

      setTransferStatus(`Transaction submitted: ${hash}`);
      setStep(3);

      // 等待交易确认
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === 'success') {
        setTransferStatus('Transfer successful!');
        fetchTokenData(); // 刷新余额
      } else {
        setTransferStatus('Transfer failed');
      }
    } catch (error) {
      console.error('Transfer failed:', error);
      setTransferStatus(`Error: ${error.shortMessage || error.message}`);
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tokenAddress && address) {
      fetchTokenData();
    }
  }, [tokenAddress, address, chainId]);

  if (!tokenInfo) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Token Transfer</h2>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-1/2"></div>
          <div className="h-10 bg-gray-700 rounded mb-6"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Token Transfer</h2>

      <div className="mb-6 p-4 bg-gray-900 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 font-medium">Token</p>
            <p className="text-white">
              {tokenInfo.name} ({tokenInfo.symbol})
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 font-medium">Your Balance</p>
            <p className="text-white">
              {formatBalance(balance, tokenInfo.decimals)} {tokenInfo.symbol}
            </p>
          </div>
        </div>
      </div>

      {step === 1 && (
        <>
          <div className="mb-6">
            <label className="block text-gray-400 font-medium mb-2">
              Amount to Transfer
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.1"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter amount"
              />
              <span className="absolute right-3 top-3 text-gray-400">
                {tokenInfo.symbol}
              </span>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300"
          >
            Continue to Transfer
          </button>
        </>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Transfer Details</h3>

            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">From</span>
              <span className="text-white font-mono">{formatAddress(address)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">To</span>
              <span className="text-white font-mono">{formatAddress(address)}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Amount</span>
              <span className="text-white">
                {amount} {tokenInfo.symbol}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Back
            </button>

            <button
              onClick={executeTokenTransfer}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="animate-spin">⚙️</span>
              ) : (
                <>
                  Confirm Transfer <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-6">
          {transferStatus.includes('success') ? (
            <div className="text-green-400 mb-4">
              <FaCheck size={48} className="mx-auto mb-3" />
              <h3 className="text-2xl font-bold">Transfer Successful!</h3>
            </div>
          ) : (
            <div className="text-red-400 mb-4">
              <FaTimes size={48} className="mx-auto mb-3" />
              <h3 className="text-2xl font-bold">Transfer Failed</h3>
            </div>
          )}

          <p className="mb-6 bg-gray-900 p-4 rounded-lg break-all">
            {transferStatus}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              New Transfer
            </button>

            <button
              onClick={fetchTokenData}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300"
            >
              Refresh Balance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}