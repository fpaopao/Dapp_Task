import styles from "@/styles/home.module.css"
import { formatUnits, formatEther, parseEther, parseUnits } from "viem";
import React, { useEffect, useState, useCallback } from 'react';
import { useAccount, useBalance } from 'wagmi';
import toast from 'react-hot-toast';
import { getUserStake, optionsConfig, stake, getWriteOptions } from "@/contracts/stakingContractEthers.ts"

export default function Home() {
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: isConnected,
      refetchInterval: 10000,
      refetchIntervalInBackground: false,
    }
  });

  const getUserStakeAccount = useCallback(async () => {
    if (!address) return;
    const network = await optionsConfig.provider.getNetwork();
    const res = await getUserStake(optionsConfig, address);
    if (res) {
      console.log("🚀 ~ getUserStakeAccount ~ res:", res)
      setCount(formatUnits(res, 18))
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      getUserStakeAccount();
    }
  }, [isConnected, address, getUserStakeAccount]);

  const stakeSendBtn = async () => {
    try {
      if (amount == 0 || amount == "") {
        toast.error("请输入正确金额"); return
      } else if (amount > parseFloat(balance?.formatted)) {
        toast.error("余额不足");
        return
      }
      setLoading(true)
      // 获取写入配置
      const writeOptions = await getWriteOptions();
      const res = await stake(writeOptions, parseUnits(amount, 18))
      if (res.hash) {
        await res.wait(); // 
        getUserStakeAccount()
        toast.success('操作成功！');
        setLoading(false)
        setAmount("")
      }
    } catch (e) {
      toast.error('操作失败');
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return;
  }



  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
        stake
        <div>
          <p>stakedAmount:{parseFloat(count).toFixed(4)}ETH</p>
        </div>
      </h1>


      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="form-group">
            <label id="stTokenAddress" className={styles.label}>To Stake</label>
            <input type="text" className={styles.input} placeholder="ETH" onChange={(e) => setAmount(e.target.value)} value={amount} />
          </div>

          <button
            onClick={stakeSendBtn}
            className={styles.button}
            disabled={loading}
          >
            {loading ? '处理中...' : '质押'}
          </button>
        </div>
      </div>
    </div>
  );
}

