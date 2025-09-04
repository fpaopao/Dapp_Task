import styles from "@/styles/home.module.css";
import { formatUnits, parseUnits } from "viem";
import React, { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useStakingContract } from "@/contracts/stakingContract";
import toast from "react-hot-toast";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { config as configWagmi } from "@/config/wagmi";
import { STAKING_CONTRACT_CONFIG } from "@/contracts/stakingContract";

export default function Home() {
  const { isConnected, address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: isConnected,
      refetchInterval: 10000,
      refetchIntervalInBackground: false,
    },
  });

  const { useUserStake } = useStakingContract();

  const { data: userStake, refetch: refetchStake } = useUserStake(address, {
    watch: true,
  });

  const stakeSendBtn = async () => {
    try {
      if (amount == 0 || amount == "") {
        toast.error("请输入正确金额");
        return;
      } else if (amount > parseFloat(balance?.formatted)) {
        toast.error("余额不足");
        return;
      }
      setIsLoading(true);
      // 使用 writeContract 发送交易
      const hash = await writeContract(configWagmi, {
        ...STAKING_CONTRACT_CONFIG,
        functionName: "depositETH",
        args: [],
        value: parseUnits(amount, 18),
      });
      // 使用 waitForTransactionReceipt 等待交易确认
      const receipt = await waitForTransactionReceipt(configWagmi, {
        hash: hash,
        timeout: 120000, // 可选：设置超时（毫秒）
        pollingInterval: 2000, // 可选：设置轮询间隔（毫秒）
      });

      console.log("🚀 ~ stakeSendBtn ~ receipt:", receipt);
      if ((receipt.status = "success")) {
        setIsLoading(false);
        toast.success("成功");
        await refetchStake();
        setAmount("");
      } else {
        toast.error("失败");
      }
      // const result = await stakeDepositETH(parseUnits(amount, 18));
    } catch (e) {}
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
        stake
        <div>
          <p>stakedAmount:{userStake && formatUnits(userStake, 18)}ETH</p>
        </div>
      </h1>

      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="form-group">
            <label id="stTokenAddress" className={styles.label}>
              To Stake
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="ETH"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </div>

          <button
            onClick={stakeSendBtn}
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "处理中..." : "质押"}
          </button>
        </div>
      </div>
    </div>
  );
}
