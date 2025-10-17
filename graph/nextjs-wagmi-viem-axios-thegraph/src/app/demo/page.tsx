"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { TokenData, TransferData, MetaData, UserData } from "@/types";

const SUBGRAPH_URL =
  process.env.SUBGRAPH_URL ||
  "https://api.studio.thegraph.com/query/1685450/my-erc20-subgraph/v0.0.2";

export default function page() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [transfers, setTransfers] = useState<TransferData[]>([]);
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async (query: string): Promise<any> => {
    try {
      const response = await axios.post(SUBGRAPH_URL, { query });
      console.log("🚀 ~ executeQuery ~ SUBGRAPH_URL:", SUBGRAPH_URL, response);
      if (response.data.errors) {
        throw new Error(
          response.data.errors.map((e: any) => e.message).join(", ")
        );
      }
      return response.data.data;
    } catch (error) {
      console.error("GraphQL query error:", error);
      throw new Error(`GraphQL查询失败: ${error.message}`);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 获取用户信息
      const userData = await executeQuery(`
        query {
          users {
            id
            balance
          }
        }`);
      setUsers(userData.users);
      console.log("🚀 ~ fetchData ~ userData:", userData);

      // 获取代币信息
      const tokenData = await executeQuery(`
        query {
          tokens {
            id
            name
            symbol
            totalSupply
            totalTransfers
            totalHolders
          }
        }
      `);
      setTokens(tokenData.tokens);

      // 获取转账记录
      const transferData = await executeQuery(`
        query {
          transfers(first: 5, orderBy: blockTimestamp, orderDirection: desc) {
            id
            from
            to
            amount
            blockNumber
            blockTimestamp
            transactionHashBytes
          }
        }
      `);
      setTransfers(transferData.transfers);

      // 获取元数据
      const metaData = await executeQuery(`
        query {
          _meta {
            block {
              number
            }
            hasIndexingErrors
          }
        }
      `);
      setMetadata(metaData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTokenAmount = (amount: string, decimals: number = 18): string => {
    if (!amount) return "0";
    const value = parseFloat(amount) / Math.pow(10, decimals);
    return new Intl.NumberFormat("zh-CN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    }).format(value);
  };

  const formatTimestamp = (timestamp: string): string => {
    if (!timestamp) return "-";
    return new Date(parseInt(timestamp) * 1000).toLocaleString("zh-CN");
  };

  const shortenAddress = (address: string): string => {
    if (!address) return "-";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };
  const isZeroAddress = (addr: string) =>
    addr === "0x0000000000000000000000000000000000000000";

  return (
    <div className="dark-theme">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🔍 The Graph 数据展示</h1>
          <p className="text-lg opacity-80">
            实时展示从 Subgraph 获取的区块链数据
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={fetchData}
            disabled={loading}
            className="btn btn-primary"
          >
            🔄 {loading ? "刷新中..." : "刷新数据"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-400 rounded-lg text-red-300">
            <strong>错误!</strong> {error}
          </div>
        )}
        <div>
          {users.length > 0 &&
            users.map(user => (
              <div key={user.id} className="mb-2 p-2 border-b border-gray-700">
                <p>用户ID: {user.id}</p>
                <p>余额: {formatTokenAmount(user.balance)} STK</p>
              </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Token Info Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🪙 代币信息
            </h2>
            <p className="text-sm opacity-70 mb-4">
              SimpleToken (STK) 的基本信息
            </p>
            {tokens.length > 0 ? (
              <div className="space-y-2">
                <p>
                  <strong>名称:</strong> {tokens[0].name}
                </p>
                <p>
                  <strong>符号:</strong> {tokens[0].symbol}
                </p>
                <p>
                  <strong>总供应量:</strong>{" "}
                  {formatTokenAmount(tokens[0].totalSupply)} STK
                </p>
                <p>
                  <strong>总转账次数:</strong> {tokens[0].totalTransfers}
                </p>
                <p>
                  <strong>总持有者:</strong> {tokens[0].totalHolders}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 opacity-70">
                <div className="text-4xl mb-4">🪙</div>
                <p>暂无代币数据</p>
              </div>
            )}
          </div>

          {/* Recent Transfers Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📈 最近转账
            </h2>
            <p className="text-sm opacity-70 mb-4">最新的转账记录</p>
            {transfers.length > 0 ? (
              <div className="space-y-3">
                {transfers.map(transfer => {
                  const fromAddr = transfer.from?.split("-")[1] || "";
                  const toAddr = transfer.to?.split("-")[1] || "";

                  return (
                    <div
                      key={transfer.id}
                      className="border rounded-lg p-3 hover:bg-opacity-20 transition-colors"
                    >
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span
                          className={`badge ${
                            isZeroAddress(fromAddr)
                              ? "badge-success"
                              : "badge-secondary"
                          }`}
                        >
                          {isZeroAddress(fromAddr) ? "铸造" : "转账"}
                        </span>
                        <span className="opacity-70">
                          区块 #{transfer.blockNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 flex-1">
                          <span className="opacity-70">从:</span>
                          <span className="text-sm font-mono">
                            {isZeroAddress(fromAddr)
                              ? "🔥 零地址"
                              : shortenAddress(fromAddr)}
                          </span>
                          <span className="opacity-50">→</span>
                          <span className="opacity-70">到:</span>
                          <span className="text-sm font-mono">
                            {isZeroAddress(toAddr)
                              ? "🔥 零地址"
                              : shortenAddress(toAddr)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">
                            {formatTokenAmount(transfer.amount)} STK
                          </div>
                          <a
                            href={`https://sepolia.etherscan.io/tx/${transfer.transactionHashBytes}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                          >
                            交易 ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 opacity-70">
                <div className="text-4xl mb-4">📈</div>
                <p>暂无转账记录</p>
              </div>
            )}
          </div>
        </div>

        {/* Subgraph Metadata Card */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">📊 数据源信息</h2>
          {metadata ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Subgraph URL:</strong>{" "}
                <code className="bg-opacity-10 px-2 py-1 rounded">
                  {SUBGRAPH_URL}
                </code>
              </p>
              <p>
                <strong>网络:</strong> Sepolia 测试网
              </p>
              <p>
                <strong>合约地址:</strong>{" "}
                <code className="bg-opacity-10 px-2 py-1 rounded">
                  0x8D5E...C239
                </code>
              </p>
              <p>
                <strong>最新区块:</strong>{" "}
                {metadata._meta.block.number.toLocaleString()}
              </p>
              <p>
                <strong>索引错误:</strong>{" "}
                {metadata._meta.hasIndexingErrors ? "是" : "否"}
              </p>
              <p>
                <strong>更新时间:</strong> {new Date().toLocaleString("zh-CN")}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 opacity-70">
              <div className="text-4xl mb-4">👤</div>
              <p>无法获取元数据</p>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <a href="/" className="btn btn-secondary">
            ← 返回主页
          </a>
        </div>
      </div>
    </div>
  );
}
