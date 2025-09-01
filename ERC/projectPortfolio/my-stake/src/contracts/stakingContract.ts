import { STAKING_ABI } from './abi';
import { useContractWrite } from '../hooks/useContractWrite';
import { useContractRead } from '../hooks/useContractRead';
import { ContractConfig, ReadOptions } from './types';
import { Address } from 'viem';
// 合约地址
import { tokenAddress } from "@/config/wagmi";
export const tokenAddress = "0x4104b3D5F60D682a51Bd7d33e467249F10727263";
export const walletAddress = "0x3623843CB3685FDF05a808c4088b0AAFCB54d33a"

const STAKING_CONTRACT_CONFIG: ContractConfig = {
  address: tokenAddress, // 合约地址
  abi: STAKING_ABI,
};

export const useStakingContract = () => {
  const { executeWrite, ...rest } = useContractWrite(STAKING_CONTRACT_CONFIG);
  // 读取用户质押信息
  const useUserStake = (userAddress?: Address, options?: ReadOptions) => {
    return useContractRead<bigint>({
      address: STAKING_CONTRACT_CONFIG.address,
      abi: STAKING_CONTRACT_CONFIG.abi,
      functionName: 'stakingBalance',
      args: [0, userAddress],
    }, options);
  };

  const stakeDepositETH = async (value) => {
    return executeWrite('depositETHId','depositETH', [], value);
  }

  // ----------------widthdraw
  const useUserStakingBalance = (userAddress?: Address, options?: ReadOptions) => {
    return useContractRead<bigint>({
      address: STAKING_CONTRACT_CONFIG.address,
      abi: STAKING_CONTRACT_CONFIG.abi,
      functionName: 'stakingBalance',
      args: [0, userAddress],
    }, options);
  };

  const useUserWithdrawAmount = (userAddress?: Address, options?: ReadOptions) => {
    return useContractRead<bigint>({
      address: STAKING_CONTRACT_CONFIG.address,
      abi: STAKING_CONTRACT_CONFIG.abi,
      functionName: 'withdrawAmount',
      args: [0, userAddress],
    }, options);
  };

  const unStake = async (value) => {
    return executeWrite('unstakeId','unstake', [0, value]);
  }

  
  const withDrawEth = async () => {
    return executeWrite('withDrawEthId','withdraw', [0]);
  }


  return {
    useUserStake,
    useUserStakingBalance,
    useUserWithdrawAmount,
    stakeDepositETH,
    unStake,
    withDrawEth,
    ...rest
  };
};