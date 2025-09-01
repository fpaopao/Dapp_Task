import { BrowserProvider, ethers } from 'ethers';
import { readContract, writeContract, ReadOptions, WriteOptions } from '@/hooks/ethersContracts';
import { STAKING_ABI } from './abi';

// 合约地址 (请替换为实际地址)
export const META_NODE_STAK_ADDRESS = "0x4104b3D5F60D682a51Bd7d33e467249F10727263";

// 读取配置
export const optionsConfig = {
  provider:null,
  contractAddress: META_NODE_STAK_ADDRESS,
  contractABI: STAKING_ABI
}

export const optionConfigWrite = {
   provider: null,
    contractAddress: META_NODE_STAK_ADDRESS,
    contractABI: STAKING_ABI,
    signer: null
}

// 读取用户质押金额
export async function getUserStake(
  options: ReadOptions,
  userAddress: string
): Promise<any> {
  return readContract(options, 'stakingBalance', [0, userAddress]);
}

// 执行质押操作
export async function stake(
  options: WriteOptions,
  amount: bigint
): Promise<any> {
  return writeContract(options, 'depositETH', [], {
    value: amount // 通过overrides传递ETH金额
  });
}

// withdraw
// ---duqu 
export async function getStakingBalance(
  options: ReadOptions,
  userAddress: string
): Promise<any> {
  return readContract(options, 'stakingBalance', [0, userAddress]);
}

export async function getWithdrawAmount(
  options: ReadOptions,
  userAddress: string
): Promise<any> {
  return readContract(options, 'withdrawAmount', [0, userAddress]);
}

// 解压
export async function unStake(
  options: WriteOptions,
  amount: bigint
): Promise<any> {
  return writeContract(options, 'unstake', [0,amount]);
}

export async function setWithdraw(
  options: WriteOptions,
): Promise<any> {
  return writeContract(options, 'withdraw', [0]);
}
