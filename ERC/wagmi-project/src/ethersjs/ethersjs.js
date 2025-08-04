import {useState, useEffect} from 'react';
import {ethers} from 'ethers';

const LOCAL_RPC_URL = 'http://localhost:5777'; // 本地开发链地址
const OWER_URL = "0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e";
const TO_URL = "0x28d9CED9234b5b82A9a02E2B2563BB4C6B7dF942";
// 合约地址
const CONTRACTS_URL = '0x8622bbab4157926a0afd2c2fd83a8a325bd8fe5e';

export default function WalletConnector() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState('');
  const [isLocalNetwork, setIsLocalNetwork] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // const provider = new ethers.BrowserProvider(window.ethereum); // 需 await 获取 Signer
    // console.log(await provider.getNetwork()); // 输出网络信息:cite[4]

    // 自定义节点
    const localProvider = new ethers.JsonRpcProvider(LOCAL_RPC_URL);
    setProvider(localProvider);
  }, [])

  const getData = async () => {
    const signer = await provider.getSigner();
    setSigner(signer);
    const balance = await provider.getBalance(OWER_URL);
    setBalance(ethers.formatEther(balance));

    //   ---获取当前链ID和区块号‌
    const network = await provider.getNetwork();
    // network.chainId; // 1 代表主网
    const blockNumber = await provider.getBlockNumber();
    const getPrice = await provider.getFeeData();
    console.log("network-blockNumber-getFeeData", network, blockNumber, getPrice);
  }

  // 往其余账户中转账
  const sendEth = async () => {
    const res = await signer.sendTransaction({
      to: TO_URL,
      value: ethers.parseEther("1")
    });
    const receipt = await res.wait(); // 等待交易确认
    console.log("交易哈希:", res.hash);
    getData()
    eventWatch()
    const address = await signer.getAddress(); // 当前账户地址
    console.log("%c 1 --> Line: 53||ethersjs.js\n address: ", "color:#f0f;", address);

    // 消息签名
    // const signature = await signer.signMessage("Hello Web3"); // 用于身份验证:cite[8]
    // console.log("%c 1 --> Line: 53||ethersjs.js\n signature: ","color:#f0f;", signature);
  }

  const getContract = async () => {
    const contract = new ethers.Contract(
      CONTRACTS_URL,
      ["function balanceOf(address) view returns (uint256)"],
      signer
    );
    const balance = await contract.balanceOf(CONTRACTS_URL);
    console.log(balance, "balance2")

    // 模拟执行，不上链
    const balance1 = await contract.balanceOf.staticCall(CONTRACTS_URL);
    console.log("%c 1 --> Line: 71||ethersjs.js\n balance: ", "color:#f0f;", balance1);
  }

// 写入交易（改变状态）
  const changeContracts = async () => {
    const contract = new ethers.Contract(
      CONTRACTS_URL,
      ["function transfer(address,uint256) view returns (uint256)"],
      signer
    );
    const tx = await contract.transfer(TO_URL, 1);
    // const receipt = await tx.wait(); // 等待交易确认
    console.log("receipt-tx:", tx);
    eventWatch()
  }


  const eventWatch = () => {
    const contract = new ethers.Contract(
      CONTRACTS_URL,
      ["event Transfer(address indexed from, address indexed to, uint value)"],
      provider
    )
    // 1. 单地址过滤（只监听转入特定地址的交易）
    const filterTo = contract.filters.Transfer(null, TO_URL);
    contract.on(filterTo, (from, to, value) => {
      console.log(`转入交易: ${from} → ${to}`);
    });

// 2. 地址对过滤（监听两个特定地址间的转账）
//     const filterPair = contract.filters.Transfer(
//       "0x...发送方...",
//       "0x...接收方..."
//     );

// 3. 历史事件查询（获取过去100个区块内的转账记录）
//     const history = await contract.queryFilter("Transfer", -100);
//     history.forEach(event => {
//       console.log(event.args);
//     });

    // 设置 Transfer 事件监听
    contract.on("Transfer", (from, to, value, event) => {
      console.log(`转账事件: ${from} -> ${to} ${ethers.formatUnits(value, 18)}`);
      // 事件对象包含的详细信息:
      // event.args - 事件参数数组 [from, to, value]
      // event.blockNumber - 事件所在区块号
      // event.transactionHash - 交易哈希
      // event.logIndex - 日志索引
    });
  }

  return (
    <div>
      <button onClick={() => getData()}>getData</button>
      <p>signer:{signer && signer.address}</p>
      <p>balance:{balance}</p>
      <button onClick={() => sendEth()}>sendEth</button>
      <br/>
      <button onClick={() => getContract()}>getContract</button>
      <br/>
      <button onClick={() => changeContracts()}>changeContracts</button>
      <br/>
      <button onClick={() => eventWatch()}>eventWatch</button>


    </div>
  )
}
