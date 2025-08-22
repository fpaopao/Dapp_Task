// src/lib/wagmi/utils.ts
import { Address } from 'viem';

/**
 * 格式化以太坊地址
 *
 * 将地址缩短为：0x1234...5678
 *
 * @param address 完整的以太坊地址
 * @returns 格式化后的地址
 */
export const formatAddress = (address: Address): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * 处理大数字
 *
 * 将 BigInt 转换为可读的字符串
 *
 * @param value BigInt 值
 * @param decimals 代币精度
 * @returns 格式化后的字符串
 */
export const formatBigInt = (value: bigint, decimals: number = 18): string => {
  return (Number(value) / 10 ** decimals).toFixed(4);
};

/**
 * 处理合约错误
 *
 * 将合约错误转换为友好的错误消息
 *
 * @param error 原始错误对象
 * @returns 友好的错误消息
 */
export const handleContractError = (error: any): string => {
  console.log("🚀 ~ handleContractError ~ error:", error)
  // 用户拒绝交易
  if (error.message.includes('User rejected the request')) {
    return '您拒绝了交易请求';
  }

  // 余额不足
  if (error.message.includes('insufficient funds')) {
    return '余额不足';
  }

  // 合约特定错误
  
  if (error.message.includes('revert')) {
    console.log("🚀 ~ handleContractError ~ error.message:", error.message)

    const reasonMatch = error.message.match(/reverted with reason string '(.*?)'/);
    if (reasonMatch && reasonMatch[1]) {
      return `合约错误: ${reasonMatch[1]}`;
    }
    return '合约执行失败';
  }

  // 其他错误
  return `未知错误: ${error.message.substring(0, 100)}`;
};