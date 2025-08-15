'use client';

import {useState} from 'react';
import {useAccount, useWriteContract, useContractRead, useSendTransaction, useWaitForTransactionReceipt} from 'wagmi';
import {parseEther, erc20Abi} from 'viem';

// ERC20 合约地址（部署到 Ganache 的地址）
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "0x8622BBab4157926a0AFd2C2FD83a8a325Bd8Fe5e";

export default function TransferForm() {
  const {address} = useAccount();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');

  // 获取代币小数位
  const {data: decimals} = useContractRead({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'decimals'
  });
  console.log("%c 1 --> Line: 25||TransferForm.jsx\n decimals: ", "color:#f0f;", decimals);

  // 转账函数
  const {writeContractAsync, writeContract} = useWriteContract();
  console.log("%c 1 --> Line: 78||TransferForm.jsx\n useWriteContract(): ", "color:#f0f;", useWriteContract());

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setTransactionHash('');

    if (!address) {
      setError('Please connect your wallet');
      return;
    }

    if (!recipient || !amount) {
      setError('Please fill all fields');
      return;
    }

    if (decimals === undefined) {
      setError('Failed to get token decimals');
      return;
    }

    try {
      setIsLoading(true);

      // 转换为 BigInt
      const amountInWei = parseEther(amount, decimals);
      console.log("%c 1 --> Line: 55||TransferForm.jsx\n amountInWei: ", "color:#f0f;", amountInWei);

      // 执行转账
      const hash = await writeContractAsync({
        address: TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient, amountInWei]
      });
      console.log("%c 1 --> Line: 62||TransferForm.jsx\n hash: ", "color:#f0f;", hash);
      setTransactionHash(hash)
      setRecipient('');
      setAmount('');
    } catch (err) {
      console.error('Transfer failed:', err);
      setError(err.shortMessage || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // 账户之间,第三方账户转到自己账户，需要第三方账户授权后才能进行转账，手机扫码授权
  const {data: hash, sendTransaction, isPending} = useSendTransaction();
  // 监听交易状态
  const {isLoading: isConfirming} = useWaitForTransactionReceipt({hash});
  const transferAccount = () => {
    try {
      const hash = sendTransaction({
        account: address,
        to: "0x28d9CED9234b5b82A9a02E2B2563BB4C6B7dF942",
        value: parseEther('40')// 1 ETH → Wei
      })
      console.log("%c 1 --> Line: 88||TransferForm.jsx\n sendTransactionhash: ", "color:#f0f;", hash);
    } catch (err) {
      alert(err)
    }
  }


  return (
    <>
      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">接收地址</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            step="any"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {transactionHash && (
          <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400">
            success! Hash: {transactionHash}...
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-medium ${
            isLoading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isLoading ? '进行中，请稍等。。。' : '转账按钮'}
        </button>
      </form>
      ------------<br/>
      {/*<div>*/}
      {/*  <button*/}
      {/*    onClick={handleSend}*/}
      {/*    disabled={isPending}*/}
      {/*  >*/}
      {/*    {isPending ? '等待钱包确认' : '转账 1 ETH'}*/}
      {/*  </button>*/}

      {/*  {hash && <p>交易哈希: {hash}</p>}*/}
      {/*  {isConfirming && <p>交易确认中...</p>}*/}
      {/*</div>*/}
      <button onClick={() => transferAccount()}>
        账户转账
      </button>
    </>
  );
}