// import {erc20Abi} from './abi';
import {publicClient, walletClient} from "@/config/web3"
import {getContract, erc20Abi} from "viem"
// 1. 创建合约实例
const contract = getContract({
  address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || "0x8622BBab4157926a0AFd2C2FD83a8a325Bd8Fe5e",
  abi: erc20Abi,
  // 1b. 或公共和/或钱包客户端
  client: {public: publicClient, wallet: walletClient}
})

// 获取balance
export async function readContractBalanceOf(address) {
  const balance = await contract.read.balanceOf([
    address
  ])
  return balance;
}

