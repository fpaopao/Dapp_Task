import { erc20Abi } from './abi';
import { createPublicClient, createWalletClient, custom, encodeFunctionData,http } from 'viem';
import { supportedChains } from '@/config/chains';

export class TokenContract {
  constructor(address, chainId, walletClient) {
    this.address = address;
    this.chainId = chainId;
    this.walletClient = walletClient;

    // 创建公共客户端
    this.publicClient = createPublicClient({
      chain: supportedChains.find(c => c.id === chainId),
      transport: http()
    });
  }

  async getInfo() {
    try {
      const [name, symbol, decimals] = await Promise.all([
        this.publicClient.readContract({
          address: this.address,
          abi: erc20Abi,
          functionName: 'name'
        }),
        this.publicClient.readContract({
          address: this.address,
          abi: erc20Abi,
          functionName: 'symbol'
        }),
        this.publicClient.readContract({
          address: this.address,
          abi: erc20Abi,
          functionName: 'decimals'
        })
      ]);

      return { name, symbol, decimals };
    } catch (error) {
      console.error('Failed to fetch token info:', error);
      throw error;
    }
  }

  async getBalance(account) {
    try {
      const balance = await this.publicClient.readContract({
        address: this.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account]
      });

      return balance.toString();
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      throw error;
    }
  }

  async transfer(to, amount, decimals) {
    try {
      const amountInWei = this.toWei(amount, decimals);

      const hash = await this.walletClient.writeContract({
        address: this.address,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [to, amountInWei],
      });

      return hash;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  }

  async transferFrom(from, to, amount, decimals) {
    try {
      const amountInWei = this.toWei(amount, decimals);

      const hash = await this.walletClient.writeContract({
        address: this.address,
        abi: erc20Abi,
        functionName: 'transferFrom',
        args: [from, to, amountInWei],
      });

      return hash;
    } catch (error) {
      console.error('TransferFrom failed:', error);
      throw error;
    }
  }

  async approve(spender, amount, decimals) {
    try {
      const amountInWei = this.toWei(amount, decimals);

      const hash = await this.walletClient.writeContract({
        address: this.address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, amountInWei],
      });

      return hash;
    } catch (error) {
      console.error('Approve failed:', error);
      throw error;
    }
  }

  async allowance(owner, spender) {
    try {
      const allowance = await this.publicClient.readContract({
        address: this.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [owner, spender]
      });

      return allowance.toString();
    } catch (error) {
      console.error('Failed to fetch allowance:', error);
      throw error;
    }
  }

  toWei(amount, decimals) {
    return BigInt(Number(amount) * BigInt(10 ** decimals)) ;
  }
}