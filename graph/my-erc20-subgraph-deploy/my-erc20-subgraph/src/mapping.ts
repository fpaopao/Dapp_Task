import {
  Transfer as TransferEvent,
  TokenMinted as TokenMintedEvent,
  TokenBurned as TokenBurnedEvent,
  TokenTransferred as TokenTransferredEvent
} from "../generated/SimpleToken/SimpleToken";

import { Token, User, Transfer, Mint, Burn } from "../generated/schema";

import { BigInt, Address, Bytes, log } from "@graphprotocol/graph-ts";

// 常量定义
const ZERO_BI = BigInt.fromI32(0);
const ONE_BI = BigInt.fromI32(1);
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// 辅助函数：获取或创建代币实体
function getOrCreateToken(tokenAddress: Address): Token {
  let token = Token.load(tokenAddress.toHex());

  if (token == null) {
    token = new Token(tokenAddress.toHex());
    token.name = "SimpleToken";
    token.symbol = "STK";
    token.decimals = 18;
    token.totalSupply = ZERO_BI;
    token.maxSupply = BigInt.fromI32(1000000).times(BigInt.fromI32(10).pow(18));
    token.totalTransfers = ZERO_BI;
    token.totalMints = ZERO_BI;
    token.totalBurns = ZERO_BI;
    token.totalHolders = ZERO_BI;
    token.totalMinted = ZERO_BI;
    token.totalBurned = ZERO_BI;
    token.totalTransferred = ZERO_BI;
    token.createdAt = BigInt.fromI32(0);
    token.lastUpdated = BigInt.fromI32(0);
    token.save();
  }

  return token as Token;
}

// 辅助函数：获取或创建用户实体
function getOrCreateUser(userAddress: Address, token: Token): User {
  let userId = token.id + "-" + userAddress.toHex();
  let user = User.load(userId);

  if (user == null) {
    user = new User(userId);
    user.token = token.id;
    user.balance = ZERO_BI;
    user.transferCount = ZERO_BI;
    user.mintCount = ZERO_BI;
    user.burnCount = ZERO_BI;
    user.totalReceived = ZERO_BI;
    user.totalSent = ZERO_BI;
    user.totalMinted = ZERO_BI;
    user.totalBurned = ZERO_BI;
    user.firstTransactionAt = ZERO_BI;
    user.lastTransactionAt = ZERO_BI;
    user.isActive = true;
    user.save();
  }

  return user as User;
}

// 处理标准转账事件
export function handleTransfer(event: TransferEvent): void {
  let token = getOrCreateToken(event.address);
  let fromUser = getOrCreateUser(event.params.from, token);
  let toUser = getOrCreateUser(event.params.to, token);

  // 创建转账记录
  let transferId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let transfer = new Transfer(transferId);

  transfer.token = token.id;
  transfer.from = fromUser.id;
  transfer.to = toUser.id;
  transfer.amount = event.params.value;
  transfer.blockNumber = event.block.number;
  transfer.blockTimestamp = event.block.timestamp;
  transfer.transactionHashBytes = event.transaction.hash;
  transfer.logIndex = event.logIndex;
  transfer.transferType = "STANDARD";

  // 处理铸造（从零地址转出）
  if (event.params.from.toHex() == ZERO_ADDRESS) {
    transfer.transferType = "MINT";
    token.totalSupply = token.totalSupply.plus(event.params.value);
    token.totalMints = token.totalMints.plus(ONE_BI);
    token.totalMinted = token.totalMinted.plus(event.params.value);

    toUser.balance = toUser.balance.plus(event.params.value);
    toUser.totalReceived = toUser.totalReceived.plus(event.params.value);
    toUser.mintCount = toUser.mintCount.plus(ONE_BI);
  }
  // 处理销毁（转入零地址）
  else if (event.params.to.toHex() == ZERO_ADDRESS) {
    transfer.transferType = "BURN";
    token.totalSupply = token.totalSupply.minus(event.params.value);
    token.totalBurns = token.totalBurns.plus(ONE_BI);
    token.totalBurned = token.totalBurned.plus(event.params.value);

    fromUser.balance = fromUser.balance.minus(event.params.value);
    fromUser.totalSent = fromUser.totalSent.plus(event.params.value);
    fromUser.burnCount = fromUser.burnCount.plus(ONE_BI);
  }
  // 标准转账
  else {
    fromUser.balance = fromUser.balance.minus(event.params.value);
    fromUser.totalSent = fromUser.totalSent.plus(event.params.value);
    fromUser.transferCount = fromUser.transferCount.plus(ONE_BI);

    toUser.balance = toUser.balance.plus(event.params.value);
    toUser.totalReceived = toUser.totalReceived.plus(event.params.value);
    toUser.transferCount = toUser.transferCount.plus(ONE_BI);
  }

  // 更新时间戳
  let currentTime = event.block.timestamp;
  if (fromUser.firstTransactionAt.equals(ZERO_BI)) {
    fromUser.firstTransactionAt = currentTime;
  }
  fromUser.lastTransactionAt = currentTime;

  if (toUser.firstTransactionAt.equals(ZERO_BI)) {
    toUser.firstTransactionAt = currentTime;
  }
  toUser.lastTransactionAt = currentTime;

  // 更新代币统计
  token.totalTransfers = token.totalTransfers.plus(ONE_BI);
  token.totalTransferred = token.totalTransferred.plus(event.params.value);
  token.lastUpdated = currentTime;

  // 保存实体
  transfer.save();
  fromUser.save();
  toUser.save();
  token.save();
}

// 处理铸造事件
export function handleTokenMinted(event: TokenMintedEvent): void {
  let token = getOrCreateToken(event.address);
  let user = getOrCreateUser(event.params.to, token);

  // 创建铸造记录
  let mintId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let mint = new Mint(mintId);

  mint.token = token.id;
  mint.to = user.id;
  mint.amount = event.params.amount;
  mint.blockNumber = event.block.number;
  mint.blockTimestamp = event.block.timestamp;
  mint.transactionHashBytes = event.transaction.hash;
  mint.logIndex = event.logIndex;

  // 更新统计
  token.totalMints = token.totalMints.plus(ONE_BI);
  token.totalMinted = token.totalMinted.plus(event.params.amount);
  token.totalSupply = token.totalSupply.plus(event.params.amount);
  token.lastUpdated = event.block.timestamp;

  user.balance = user.balance.plus(event.params.amount);
  user.totalMinted = user.totalMinted.plus(event.params.amount);
  user.mintCount = user.mintCount.plus(ONE_BI);
  user.lastTransactionAt = event.block.timestamp;

  if (user.firstTransactionAt.equals(ZERO_BI)) {
    user.firstTransactionAt = event.block.timestamp;
  }

  // 保存实体
  mint.save();
  user.save();
  token.save();
}

// 处理销毁事件
export function handleTokenBurned(event: TokenBurnedEvent): void {
  let token = getOrCreateToken(event.address);
  let user = getOrCreateUser(event.params.from, token);

  // 创建销毁记录
  let burnId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let burn = new Burn(burnId);

  burn.token = token.id;
  burn.from = user.id;
  burn.amount = event.params.amount;
  burn.blockNumber = event.block.number;
  burn.blockTimestamp = event.block.timestamp;
  burn.transactionHashBytes = event.transaction.hash;
  burn.logIndex = event.logIndex;

  // 更新统计
  token.totalBurns = token.totalBurns.plus(ONE_BI);
  token.totalBurned = token.totalBurned.plus(event.params.amount);
  token.totalSupply = token.totalSupply.minus(event.params.amount);
  token.lastUpdated = event.block.timestamp;

  user.balance = user.balance.minus(event.params.amount);
  user.totalBurned = user.totalBurned.plus(event.params.amount);
  user.burnCount = user.burnCount.plus(ONE_BI);
  user.lastTransactionAt = event.block.timestamp;

  if (user.firstTransactionAt.equals(ZERO_BI)) {
    user.firstTransactionAt = event.block.timestamp;
  }

  // 保存实体
  burn.save();
  user.save();
  token.save();
}

// 处理转账事件（自定义事件）
export function handleTokenTransferred(event: TokenTransferredEvent): void {
  // 这个事件处理器可以用于处理自定义的转账事件逻辑
  // 目前我们使用标准的 Transfer 事件处理器
  log.info("TokenTransferred event detected: from {} to {} amount {}", [
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.amount.toString()
  ]);
}
