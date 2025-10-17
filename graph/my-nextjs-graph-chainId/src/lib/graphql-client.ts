import { GraphQLClient } from "graphql-request";
import { CONFIG } from "./config";

// 创建GraphQL客户端
export const createGraphQLClient = (chainId: number = 1) => {
  const graphUrl = CONFIG.getCurrentChainConfig(chainId).graphUrl;
  return new GraphQLClient(graphUrl);
};

// 查询ERC20转账历史 :cite[1]
export const GET_ERC20_TRANSFERS = `
  query GetERC20Transfers($userAddress: String!, $first: Int!) {
    transfers(
      where: { from: $userAddress }
      first: $first
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      from
      to
      value
      timestamp
      transactionHash
    }
  }
`;

// 获取ERC20转账历史
export const getERC20Transfers = async (
  userAddress: string,
  chainId: number = 1,
  first: number = 10
) => {
  try {
    const client = createGraphQLClient(chainId);
    return await client.request(GET_ERC20_TRANSFERS, {
      userAddress: userAddress.toLowerCase(),
      first
    });
  } catch (error) {
    console.error("Error fetching ERC20 transfers:", error);
    throw error;
  }
};
