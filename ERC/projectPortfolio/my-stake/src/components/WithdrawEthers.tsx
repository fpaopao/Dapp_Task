import styles from "@/styles/home.module.css";
import { formatUnits, parseUnits } from "viem";
import React, { useEffect, useState, useCallback } from "react";
import { useAccount, useBalance } from "wagmi";
import toast from "react-hot-toast";
import {
  optionsConfig,
  getStakingBalance,
  getWithdrawAmount,
  unStake,
  optionConfigWrite,
  setWithdraw,
} from "@/contracts/stakingContractEthers.ts";

import { useEthersProvider } from "@/hooks/ethersProvider";
import { useEthersSigner } from "@/hooks/ethersSigner";

export type UserStakeData = {
  staked: string;
  withdrawPending: string;
  withdrawable: string;
};

const InitData: UserStakeData = {
  staked: "0",
  withdrawable: "0",
  withdrawPending: "0",
};

export default function WithDraw() {
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const { isConnected, address } = useAccount();
  const [userData, setUserData] = useState<UserStakeData>(InitData);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  // 解压
  const [unstakeAccount, setUnstakeAccount] = useState("");

  const getStakingBalanceF = useCallback(async () => {
    if (!address) return;
    if (provider) {
      optionsConfig.provider = provider;
      const network = await optionsConfig.provider.getNetwork();
      const res = await getStakingBalance(optionsConfig, address);
      const res2 = await getWithdrawAmount(optionsConfig, address);
      if (res && res2) {
        const requestAmount = res2 && res2[0];
        const pendingWithdrawAmount = res2 && res2[1];
        const ava = Number(
          pendingWithdrawAmount && formatUnits(pendingWithdrawAmount, 18)
        );
        const total = Number(requestAmount && formatUnits(requestAmount, 18));
        setUserData({
          staked: formatUnits(res as bigint, 18),
          withdrawPending: (total - ava).toFixed(4),
          withdrawable: ava.toString(),
        });
      }
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      getStakingBalanceF();
    }
  }, [isConnected, address, getStakingBalanceF]);

  // --------dao pending
  const unStakeSendBtn = useCallback(async () => {
    if (parseFloat(unstakeAccount) <= 0) {
      toast.error("Please enter a valid amount");
      console.log("Please enter a valid amount");
      return;
    }
    if (parseFloat(unstakeAccount) > parseFloat(userData.staked)) {
      toast.error("Amount cannot be greater than staked amount");
      console.log("Amount cannot be greater than staked amount");
      return;
    }

    try {
      setUnstakeLoading(true);
      if (provider && signer) {
        optionConfigWrite.provider = provider;
        optionConfigWrite.signer = signer;
        const res = await unStake(
          optionConfigWrite,
          parseUnits(unstakeAccount, 18)
        );
        if (res.hash) {
          await res.wait(); //
          getStakingBalanceF();
          toast.success("操作成功！");
          setUnstakeLoading(false);
          setUnstakeAccount("");
        }
      }
    } catch (error) {}
  }, [userData.staked, unstakeAccount]);

  const widthdrawBtn = useCallback(async () => {
    try {
      setWithdrawLoading(true);
      if (provider && signer) {
        optionConfigWrite.provider = provider;
        optionConfigWrite.signer = signer;
        const res = await setWithdraw(optionConfigWrite);
        if (res.hash) {
          await res.wait(); //
          getStakingBalanceF();
          toast.success("操作成功！");
          setWithdrawLoading(false);
        }
      }
    } catch (error) {}
  }, [userData.withdrawable]);

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
        unStake && withDraw
      </h1>
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-primary mb-1">质押金额</div>
            <div className="text-2xl font-semibold text-primary">
              {parseFloat(userData.staked).toFixed(4)}ETH
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-primary mb-1">可提现余额</div>
            <div className="text-2xl font-semibold text-primary">
              {parseFloat(userData.withdrawable || 0).toFixed(4)}ETH
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-primary mb-1"> ‌待处理提现</div>
            <div className="text-2xl font-semibold text-primary">
              {parseFloat(userData.withdrawPending || 0).toFixed(4)}ETH
            </div>
          </div>
        </div>
        {/* ----- */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="form-group">
            <label id="" className={styles.label}>
              To UnstakeAccount
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="ETH"
              onChange={(e) => setUnstakeAccount(e.target.value)}
              value={unstakeAccount}
            />
          </div>

          <button
            onClick={unStakeSendBtn}
            className={styles.button}
            disabled={unstakeLoading || !unstakeAccount}
          >
            {unstakeLoading ? "处理中..." : "解押"}
          </button>
        </div>
        {/*  */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-20">
          <div className="form-group">
            <label id="" className={styles.label}>
              widthdraw
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder=""
              value={userData.withdrawable || ""}
              disabled
            />
          </div>

          <button
            onClick={widthdrawBtn}
            className={styles.button}
            disabled={withdrawLoading}
          >
            {withdrawLoading ? "处理中..." : "withDrawEth"}
          </button>
        </div>
      </div>
    </div>
  );
}
