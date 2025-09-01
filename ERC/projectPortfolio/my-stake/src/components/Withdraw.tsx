import styles from "@/styles/home.module.css"
import { formatUnits, parseUnits } from "viem";
import React, { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useStakingContract } from '@/contracts/stakingContract';
import toast from 'react-hot-toast';
import { STAKING_ABI } from '@/contracts/abi';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { config as configWagmi } from "@/config/wagmi"
import { tokenAddress } from "@/config/wagmi";

export type UserStakeData = {
  staked: string;
  withdrawPending: string;
  withdrawable: string;
};

const InitData: UserStakeData = {
  staked: '0',
  withdrawable: '0',
  withdrawPending: '0'
};

export default function WithDraw() {
  const { isConnected, address } = useAccount();
  const [userData, setUserData] = useState<UserStakeData>(InitData);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  // 解压
  const [unstakeAccount, setUnstakeAccount] = useState("")

  const {
    id,
    useUserStakingBalance,
    useUserWithdrawAmount,
    unStake,
    withDrawEth,
    status,
    isPending,
    isConfirming,
    isConfirmed,
  } = useStakingContract();

  // 读取
  const { data, isLoading, isError, error, refetch } = useUserWithdrawAmount(address, { watch: true });
  const res2 = useUserStakingBalance(address, { watch: true })
  const staked = res2.data ? res2.data : '';
  const requestAmount = data && data[0];
  const pendingWithdrawAmount = data && data[1];
  const ava = Number(pendingWithdrawAmount && formatUnits(pendingWithdrawAmount, 18));
  const total = Number(requestAmount && formatUnits(requestAmount, 18));
  const fetchData = async () => {
    console.log(111)
    const result = await refetch();
    setUserData({
      staked: formatUnits(staked as bigint, 18),
      withdrawPending: (total - ava).toFixed(4),
      withdrawable: ava.toString()
    });
  };
  useEffect(() => {
    fetchData();
  }, [data])
  // --------
  const unStakeSendBtn = useCallback(async () => {
    if (parseFloat(unstakeAccount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (parseFloat(unstakeAccount) > parseFloat(userData.staked)) {
      toast.error('Amount cannot be greater than staked amount');
      return;
    }

    try {
      setUnstakeLoading(true)
      // 使用 writeContract 发送交易
      const hash = await writeContract(configWagmi, {
        address: tokenAddress,
        abi: STAKING_ABI,
        functionName: 'unstake', // 要调用的函数名
        args: [0, parseUnits(unstakeAccount, 18)], // 如果函数需要参数，在此传入
      });
      // 使用 waitForTransactionReceipt 等待交易确认
      const receipt = await waitForTransactionReceipt(configWagmi, {
        hash: hash, // 传入交易哈希
        timeout: 120_000, // 可选：设置超时（毫秒）
        pollingInterval: 2_000, // 可选：设置轮询间隔（毫秒）
        // 重试策略：对于已上链的交易（无论成功失败），重试没有意义
        // retry: false 
      });

      console.log("🚀 ~ stakeSendBtn ~ receipt:", receipt)
      if (receipt.status = "success") {
        setUnstakeLoading(false)
        toast.success("成功");
        await fetchData()
        setUnstakeAccount("")
      } else {
        toast.error("失败");
      }
    } catch (error) {

    }
  }, [unStake, userData.staked, unstakeAccount, status]);





  const widthdrawBtn = async () => {
    try {
      // const res = await withDrawEth();
      setWithdrawLoading(true)
      // 使用 writeContract 发送交易
      const hash = await writeContract(configWagmi, {
        address: tokenAddress,
        abi: STAKING_ABI,
        functionName: 'withdraw', // 要调用的函数名
        args: [0], // 如果函数需要参数，在此传入
      });
      // 使用 waitForTransactionReceipt 等待交易确认
      const receipt = await waitForTransactionReceipt(configWagmi, {
        hash: hash, // 传入交易哈希
        timeout: 120_000, // 可选：设置超时（毫秒）
        pollingInterval: 2_000, // 可选：设置轮询间隔（毫秒）
        // 重试策略：对于已上链的交易（无论成功失败），重试没有意义
        // retry: false 
      });

      console.log("🚀 ~ stakeSendBtn ~ receipt:", receipt)
      if (receipt.status = "success") {
        setWithdrawLoading(false)
        toast.success("成功");
        await fetchData()
        // setUnstakeAccount("")
      } else {
        toast.error("失败");
      }
    } catch (error) {

    }
  }


  // useEffect(() => {
  //   if (isConfirmed && status == "success") {
  //     toast.success('操作成功！');
  //     if (id == "unstakeId") {
  //       setUnstakeLoading(false)
  //       setUnstakeAccount("")
  //     }
  //     if (id == "withDrawEthId") {
  //       setWithdrawLoading(false)
  //     }


  //   } else {
  //     if (id == "unstakeId") {
  //       setUnstakeLoading(true)
  //     }
  //     if (id == "withDrawEthId") {
  //       setWithdrawLoading(true)
  //     }


  //   }
  // }, [isPending, isConfirming, isConfirmed, status])


  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
        unStake && withDraw
      </h1>
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-primary mb-1">质押金额</div>
            <div className="text-2xl font-semibold text-primary">{parseFloat(userData.staked).toFixed(4)}ETH</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-primary mb-1">可提现余额</div>
            <div className="text-2xl font-semibold text-primary">{parseFloat(userData.withdrawable || 0).toFixed(4)}ETH</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-primary mb-1"> ‌待处理提现</div>
            <div className="text-2xl font-semibold text-primary">{parseFloat(userData.withdrawPending || 0).toFixed(4)}ETH</div>
          </div>
        </div>
        {/* ----- */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="form-group">
            <label id="" className={styles.label}>To UnstakeAccount</label>
            <input type="text" className={styles.input} placeholder="ETH" onChange={(e) => setUnstakeAccount(e.target.value)} value={unstakeAccount} />
          </div>

          <button
            onClick={unStakeSendBtn}
            className={styles.button}
            disabled={unstakeLoading || !unstakeAccount}
          >
            {unstakeLoading ? '处理中...' : '解押'}
          </button>
        </div>
        {/*  */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-10">
          <div className="form-group">
            <label id="" className={styles.label}>withdraw</label>
            <input type="text" className={styles.input} placeholder="" value={userData.withdrawable || ""} disabled />
          </div>

          <button
            onClick={widthdrawBtn}
            className={styles.button}
            disabled={withdrawLoading}
          >
            {withdrawLoading ? '处理中...' : 'withDrawEth'}
          </button>
        </div>
      </div>

    </div>
  );
}

