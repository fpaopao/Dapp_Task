import {
    createPublicClient,
    createWalletClient,
    http,
    formatEther,
    erc20Abi,
    parseEther,
    parseAbiItem,
    getContract
} from 'viem'
import {privateKeyToAccount} from 'viem/accounts'
import {ganacheChain} from "./config.ts"

export function Account() {
    const account = privateKeyToAccount('0xb495f6cfb7de0aebf9976585585e58f7e70d7046b5e400e0da06ecd31d76c3fb')

    const publicClient = createPublicClient({
        chain: ganacheChain,
        transport: http()
    })
    console.log("publicClient", publicClient)

    const walletClient = createWalletClient({
            chain: ganacheChain,
            transport: http(),
            account: account
        }
    )
    console.log("walletClient", walletClient)

    async function ceshi() {
        const oneEth = 1000000000000000000n;
// 公共操作--------------------------------------------
        const blockNumber = await publicClient.getBlockNumber()
        console.log("%c 1 --> Line: 22||account.tsx\n blockNumber: ", "color:#f0f;", blockNumber);
        //  查询账户余额
        const balance = await publicClient.getBalance({
            address: account.address
        })
        console.log(`本地账户余额: ${formatEther(balance)} ETH`);

        // 一个账户发送的交易数量
        const transactionCount = await publicClient.getTransactionCount({
            address: account.address
        })
        console.log("%c 1 --> Line: 40||account.tsx\n transactionCount: ", "color:#f0f;", transactionCount);

        // 返回区块信息，hash等信息
        const block = await publicClient.getBlock();
        console.log("%c 1 --> Line: 44||account.tsx\n block: ", "color:#f0f;", block);

        //区块交易数量
        const count = await publicClient.getBlockTransactionCount();
        console.log("%c 1 --> Line: 48||account.tsx\n count: ", "color:#f0f;", count);

        // 返回当前链ID
        const chainId = await publicClient.getChainId()
        console.log("%c 1 --> Line: 54||account.tsx\n chainId: ", "color:#f0f;", chainId);

        // 估算完成交易所需的 gas，而无需将其提交到网络。
        const gas = await publicClient.estimateGas({
            to: '0x28d9CED9234b5b82A9a02E2B2563BB4C6B7dF942',
            value: parseEther('1')
        })
        console.log("%c 1 --> Line: 62||account.tsx\n gas: ", "color:#f0f;", gas);

        // 过滤器
        const filter = await publicClient.createBlockFilter()
        const hashes = await publicClient.getFilterChanges({filter})
        console.log("%c 1 --> Line: 65||account.tsx\n filter: ", "color:#f0f;", filter);
        console.log("%c 1 --> Line: 66||account.tsx\n hashes: ", "color:#f0f;", hashes);

        // 返回当前的 gas 价格（以 wei 为单位）。
        const gasPrice = await publicClient.getGasPrice()
        console.log("%c 1 --> Line: 65||account.tsx\n gasPrice: ", "color:#f0f;", gasPrice);

        // 返回自过滤器创建以来的事件日志列表。注意：getFilterLogs 仅与 事件过滤器 兼容。
        // const filter2 = await publicClient.createEventFilter({
        //     address: '0x8622bbab4157926a0afd2c2fd83a8a325bd8fe5e',
        //     event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
        // })
        // const logs = await publicClient.getFilterLogs({ filter2 })
        // console.log("%c 1 --> Line: 80||account.tsx\n logs: ","color:#f0f;", logs);

        // 返回与提供的参数匹配的事件日志列表
        const logs = await publicClient.getLogs()
        console.log("%c 1 --> Line: 84||account.tsx\n logs: ", "color:#f0f;", logs);

        // 添加签名
        const signature = await walletClient.signMessage({
            account,
            message: 'hello world',
        })
        // 验证这个签名是不是上面账户签的
        const valid = await publicClient.verifyMessage({
            address: account.address,
            message: 'hello world',
            signature,
        })
        console.log("%c 1 --> Line: 98||account.tsx\n valid: ", "color:#f0f;", valid);

        //     读取合约 获取余额
        const txHash = await publicClient.readContract({
            abi: erc20Abi,
            address: "0x8622bbab4157926a0afd2c2fd83a8a325bd8fe5e",
            functionName: "balanceOf",
            args: ["0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e"],
        })
        console.log(txHash, "txHash")

        // 监听
        // const unwatch = publicClient.watchBlockNumber(
        //     { onBlockNumber: blockNumber => console.log(blockNumber) }
        // )

// 交易-------------------------------------------------------------
        //通过填充 nonce、gas 限制、费用值和交易类型来准备一个交易请求以进行签名
        // const request = await walletClient.prepareTransactionRequest({
        //     to: '0x28d9CED9234b5b82A9a02E2B2563BB4C6B7dF942',
        //     value: oneEth
        // })
        // console.log("%c 1 --> Line: 105||account.tsx\n request: ","color:#f0f;", request);
        // // signTransaction使用账户的私钥签名交易
        // const serializedTransaction = await walletClient.signTransaction(request)
        // console.log("%c 1 --> Line: 108||account.tsx\n serializedTransaction: ","color:#f0f;", serializedTransaction);
        // // 发送一个签名的交易到网络。可以与 公共客户端 和 钱包客户端 一起使用
        // const hash2 = await walletClient.sendRawTransaction({ serializedTransaction })
        // console.log("%c 1 --> Line: 109||account.tsx\n hash2: ","color:#f0f;", hash2);
        //钱包，钱包操作的示例包括检索用户的账户地址、发送交易签名消息。---------------------------------------------
        //转账,返回合约地址
        // const hxAdd = await walletClient.sendTransaction({
        //     to: "0x28d9CED9234b5b82A9a02E2B2563BB4C6B7dF942",
        //     value: parseEther("0.001")
        // })
        // console.log(hxAdd)

        // 请求由钱包管理的账户列表。此 API 对于需要访问用户账户以执行交易或与智能合约交互的 dapp 非常有用。
        // const accounts = await walletClient.requestAddresses()
        // console.log("%c 1 --> Line: 137||account.tsx\n accounts: ", "color:#f0f;", accounts);

        // const success = await walletClient.watchAsset({
        //     type: 'ERC20',
        //     options: {
        //         address: '0x8622bbab4157926a0afd2c2fd83a8a325bd8fe5e',
        //         decimals: 18,
        //         symbol: 'WETH',
        //     },
        // })
        // console.log("%c 1 --> Line: 148||account.tsx\n success: ","color:#f0f;", success);

        // 获取钱包当前的权限
        // const permissions = await walletClient.getPermissions()
        // console.log("%c 1 --> Line: 151||account.tsx\n permissions: ","color:#f0f;", permissions);

        // 1. 创建合约实例
        const contract = getContract({
            address: '0x8622bbab4157926a0afd2c2fd83a8a325bd8fe5e',
            abi: erc20Abi   ,
            // 1a. 插入单个客户端
            // client: publicClient,
            // 1b. 或公共和/或钱包客户端
            client: { public: publicClient, wallet: walletClient }
        })
        // 2. 调用合约方法，获取事件，监听事件等
        console.log("%c 1 --> Line: 163||account.tsx\n contract: ","color:#f0f;", contract);
        const totalS = await contract.read.totalSupply();
        console.log("%c 1 --> Line: 165||account.tsx\n totalS: ","color:#f0f;", totalS);
        const logs1 = await contract.getEvents.Transfer()
        console.log("%c 1 --> Line: 167||account.tsx\n logs1: ","color:#f0f;", logs1);
        const unwatch = contract.watchEvent.Transfer(
            { from: '0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e' },
            { onLogs(logs1) { console.log(logs1) } }
        )

        const logs2 = await publicClient.getContractEvents({
            abi: erc20Abi
        })
        console.log("%c 1 --> Line: 178||account.tsx\n logs2: ","color:#f0f;", logs2);

        // const { result } = await publicClient.simulateContract({
        //     address: '0x8622bbab4157926a0afd2c2fd83a8a325bd8fe5e',
        //     abi: erc20Abi,
        //     functionName: 'mint',
        //     account,
        // })
        // console.log("%c 1 --> Line: 186||account.tsx\n result: ","color:#f0f;", result);


    }


    return <div>
        <button onClick={() => ceshi()}>button</button>
    </div>;
}
