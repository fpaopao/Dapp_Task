import { useContractRead } from "@/hooks/useContract";
import { useAccount } from 'wagmi'
import { stakeAbi } from "@/assets/abis/stake"
import { defaultChainId } from "@/config/wagmi"
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';

// 合约地址
export const tokenAddress = "0x4104b3D5F60D682a51Bd7d33e467249F10727263";
export const walletAddress = "0x3623843CB3685FDF05a808c4088b0AAFCB54d33a"


// 获取质押金额
export function getStakingBalance(userAddress) {
  return useContractRead({
    address: tokenAddress,
    abi: stakeAbi,
  },
    "stakingBalance",
    [0, userAddress],
    {
      chainId: defaultChainId,
      formatter: (data) => ({ balance: data as bigint }), // 数据格式化
      query: {
        enabled: true,
        refetchInterval: 30000, // 30秒自动刷新
      },
    }
  )
}

// ---------------------------------------------------------------

export function getLengPool() {
  return useContractRead({
    address: tokenAddress,
    abi: stakeAbi,
  },
    "poolLength"
  )
}



export function getAdminRoleHash() {
  let addressCount = getAddress();
  console.log("🚀 ~ getAdminRoleHash ~ addressCount:", addressCount)

  // 读取DEFAULT_ADMIN_ROLE的哈希值
  const { data: defaultAdminRoleHash } = useReadContract({
    address: tokenAddress,
    abi: stakeAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  });

  // 检查当前用户是否具有DEFAULT_ADMIN_ROLE
  const { data: isDefaultAdmin } = useReadContract({
    address: tokenAddress,
    abi: stakeAbi,
    functionName: 'hasRole',
    args: defaultAdminRoleHash && addressCount ? [defaultAdminRoleHash, addressCount] : undefined,
    enabled: !!defaultAdminRoleHash && !!addressCount,
  });

  // 读取ADMIN_ROLE的哈希值
  const { data: adminRoleHash } = useReadContract({
    address: tokenAddress,
    abi: stakeAbi,
    functionName: 'ADMIN_ROLE',
  });

  // 检查当前用户是否具有ADMIN_ROLE
  const { data: isAdmin } = useReadContract({
    address: tokenAddress,
    abi: stakeAbi,
    functionName: 'hasRole',
    args: adminRoleHash && addressCount ? [adminRoleHash, addressCount] : undefined,
  });

  return {
    isAdmin,
    isDefaultAdmin
  };
}
