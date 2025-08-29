export class ContractError extends Error {
  public code: number;
  public details?: string;

  constructor(message: string, code: number = 500, details?: string) {
    super(message);
    this.name = 'ContractError';
    this.code = code;
    this.details = details;
  }
}

export const handleContractError = (error: any): ContractError => {
  // 处理常见的合约错误
  if (error instanceof Error) {
    if (error.message.includes('user rejected')) {
      return new ContractError('用户拒绝了交易', 4001, error.message);
    }
    if (error.message.includes('insufficient funds')) {
      return new ContractError('余额不足', 4002, error.message);
    }
    if (error.message.includes('execution reverted')) {
      return new ContractError('合约执行失败', 4003, error.message);
    }
  }
  
  return new ContractError('合约调用失败', 500, error?.message);
};