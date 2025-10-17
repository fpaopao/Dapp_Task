// 项目配置
export const CONFIG = {
  // 链配置
  CHAINS: {
    MAINNET: 1,
    SEPOLIA: 11155111
  },

  // 默认链ID
  DEFAULT_CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1"),

  // ERC20合约地址 (多链支持)
  ERC20_CONTRACT_ADDRESS: {
    1: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as `0x${string}`, // 主网 USDT
    11155111: "0xe236ece97ccb6006e35440e5c636a7ba9a7332d3" as `0x${string}` // Sepolia LINK
  },

  // The Graph Subgraph URL (多链支持)
  GRAPH_URL: {
    1:
      process.env.NEXT_PUBLIC_GRAPH_URL_MAINNET ||
      "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
    11155111:
      process.env.NEXT_PUBLIC_GRAPH_URL_SEPOLIA ||
      "https://api.studio.thegraph.com/query/120290/learn-the-graph/v0.0.2"
  },

  // RPC URL (多链支持)
  RPC_URL: {
    1: process.env.NEXT_PUBLIC_RPC_URL_MAINNET || "https://eth.llamarpc.com",
    11155111:
      process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA ||
      "https://ethereum-sepolia-public.nodies.app"
  },

  // WalletConnect 项目ID (可选)
  WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

  // 获取当前链的配置
  getCurrentChainConfig(chainId?: number) {
    const targetChainId = chainId || this.DEFAULT_CHAIN_ID;
    return {
      chainId: targetChainId,
      contractAddress:
        this.ERC20_CONTRACT_ADDRESS[
          targetChainId as keyof typeof this.ERC20_CONTRACT_ADDRESS
        ],
      graphUrl: this.GRAPH_URL[targetChainId as keyof typeof this.GRAPH_URL],
      rpcUrl: this.RPC_URL[targetChainId as keyof typeof this.RPC_URL]
    };
  }
} as const;
