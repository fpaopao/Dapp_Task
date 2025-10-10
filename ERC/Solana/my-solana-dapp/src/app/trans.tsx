"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { Button, message } from "antd";

export function TransferSol() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const sendSol = async () => {
    if (!publicKey) {
      message.error("请先连接钱包！");
      return;
    }

    try {
      // 1. 创建交易对象
      const transaction = new Transaction();

      // 2. 定义接收方地址和转账金额（这里示例为转账0.01 SOL到一个固定地址）
      const recipient = new PublicKey("接收方的钱包地址...");
      const amount = 0.01 * LAMPORTS_PER_SOL; // 将SOL转换为Lamports（1 SOL = 10^9 Lamports）

      // 3. 添加转账指令
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipient,
        lamports: amount
      });
      transaction.add(transferInstruction);

      // 4. 发送交易
      const signature = await sendTransaction(transaction, connection);
      message.info(`交易已发送，等待确认...`);

      // 5. 确认交易
      const confirmed = await connection.confirmTransaction(
        signature,
        "confirmed"
      );
      if (confirmed) {
        message.success(`交易成功！签名: ${signature}`);
      }
    } catch (error) {
      console.error("交易失败:", error);
      message.error("交易失败，请查看控制台详情。");
    }
  };

  return (
    <Button type="primary" onClick={sendSol}>
      发送 0.01 SOL
    </Button>
  );
}
