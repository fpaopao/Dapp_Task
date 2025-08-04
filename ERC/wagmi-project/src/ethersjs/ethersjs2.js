import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const LOCAL_RPC_URL = 'http://localhost:5777'; // 本地开发链地址
const OWER_URL = "0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e";
const TO_URL = "0x28d9CED9234b5b82A9a02E2B2563BB4C6B7dF942";
// 合约地址
const CONTRACTS_URL = '0x8622bbab4157926a0afd2c2fd83a8a325bd8fe5e';

export default function WalletConnector2() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const abi = [
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount)",
    "function approve(address spender, uint256 amount)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function transferFrom(address sender, address recipient, uint256 amount)",
    "function mint(address to, uint256 amount)",
    "function burn(uint256 amount)"
  ];
  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(LOCAL_RPC_URL);
    setProvider(provider);
    // const signer = new ethers.Wallet("PRIVATE_KEY", provider);

  }, [])

  const getData = async () => {
    const signer = await provider.getSigner();
    console.log("%c 1 --> Line: 14||ethersjs2.js\n signer: ", "color:#f0f;", signer);
    //   --
    const contract = new ethers.Contract(CONTRACTS_URL, abi, signer);
    console.log("%c 1 --> Line: 34||ethersjs2.js\n contract: ", "color:#f0f;", contract);

    //  查询总供应量
    const totalSupply = await contract.totalSupply();
    console.log("Total Supply:", ethers.formatUnits(totalSupply, 18)); // 假设decimals为18

    // 查询余额
    const myAddress = await signer.getAddress();//获取账户信息
    console.log("%c 1 --> Line: 42||ethersjs2.js\n myAddress: ", "color:#f0f;", myAddress);
    const balance = await contract.balanceOf(myAddress);
    console.log("My Balance:", ethers.formatUnits(balance, 18));

    //   转账
    const amount = ethers.parseUnits("10", 18); // 10个代币（注意单位转换）
    const tx = await contract.transfer(TO_URL, amount);
    await tx.wait(); // 等待交易确认
    console.log("Transfer completed!");
  }

  const transferPipe = async () => {
    const wallet = new ethers.Wallet("0xb495f6cfb7de0aebf9976585585e58f7e70d7046b5e400e0da06ecd31d76c3fb", provider)
    const tokenContract = new ethers.Contract(CONTRACTS_URL, abi, wallet);
    try {
      // 获取
      const address = await wallet.getAddress();
      console.log("%c 1 --> Line: 96||ethersjs2.js\n address: ", "color:#f0f;", address);
      // 1、获取当前余额
      const balanceBefore = await tokenContract.balanceOf(address);
      console.log("%c 1 --> Line: 96||ethersjs2.js\n balanceBefore: ", "color:#f0f;", ethers.formatUnits(balanceBefore, 18));
      // / 2. 执行转账
      const amount = ethers.parseUnits("50", 18); // 50个代币
      const tx = await tokenContract.transfer(TO_URL, amount);
      console.log("交易已发送，等待确认...");
      // 3. 等待交易确认
      const receipt = await tx.wait();
      console.log(`交易已确认，区块号: ${receipt.blockNumber}`);
      // 4. 查询转账后余额
      const balanceAfter = await tokenContract.balanceOf(address);
      console.log("转账后余额:", ethers.formatUnits(balanceAfter, 18));
      // 5. 查询接收方余额
      const recipientBalance = await tokenContract.balanceOf(TO_URL);
      console.log("接收方余额:", ethers.formatUnits(recipientBalance, 18));

    } catch (e) {
      console.log("eror", e)
    }

  }

  const weituo = async () => {
    // 链接的钱包是owner的钱包
    const wallet = new ethers.Wallet("0xb495f6cfb7de0aebf9976585585e58f7e70d7046b5e400e0da06ecd31d76c3fb", provider)
    const tokenContract = new ethers.Contract(CONTRACTS_URL, abi, wallet);

    try {
      // - Alice（地址为 owner）: 拥有代币，并且已经授权给 Bob 一定数量的代币。
      // - Bob（地址为 spender）: 被授权操作 Alice 的部分代币。
      // - Carol（地址为 recipient）: 接收代币。
      const owner = await wallet.getAddress();
      const spender = "0x28d9CED9234b5b82A9a02E2B2563BB4C6B7dF942";
      const recipient = "0x06970da3d670A6B5123D703e68C4D40668F60bdD";
      const amount = ethers.parseUnits("100", 18);
      // 1. 授权
      const approveTx = await tokenContract.approve(spender, amount);
      await approveTx.wait();
      console.log("授权成功");

      // 2. 查询授权额度
      const allowance = await tokenContract.allowance(owner, spender);
      console.log("当前授权额度:", ethers.formatUnits(allowance, 18));

      // 3. 使用spender私钥创建新钱包
      const spenderWallet = new ethers.Wallet("0x5d00117a9eeb3797d2ede7c3e4c51974623b73df15d87dffcfad7f2c27c54052", provider)
      const spenderContract = tokenContract.connect(spenderWallet);
      console.log(spenderWallet);

      // 4. 执行委托转账
      const transferTx = await spenderContract.transferFrom(owner, recipient, amount);
      await transferTx.wait();
      console.log("委托转账成功");

      // 5. 检查授权额度变化
      const newAllowance = await tokenContract.allowance(owner, spender);
      console.log("授权后剩余额度:", ethers.formatUnits(newAllowance, 18));
    } catch (err) {

    }

  }


  return (
    <div>
      <button onClick={() => getData()}>getData</button>
      <br />
      <button onClick={() => transferPipe()}>转账流程</button>
      <br />
      <button onClick={() => weituo()}>授权与委托转账流程</button>


    </div>
  );
}