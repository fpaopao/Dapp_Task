import {
    Connector,
    useConnect,
    useSendTransaction,
    useAccount,
    useDisconnect,
    useChainId,
    useBalance,
    useReadContract,
    useWaitForTransactionReceipt
} from 'wagmi'
import {parseEther} from 'viem'

export async function IndexPage() {
    // 钱包链接管理----------
    //useConnect - 钱包连接器控制
    const {connectors, connect} = useConnect()
    // useAccount - 账户状态监控
    const {address, isConnected} = useAccount()
    // 断开连接
    const {disconnect} = useDisconnect();

    // 网络交互 ----------
    // 显示当前链ID
    const chainId = useChainId()

    //资产操作--------
    // 显示ETH余额
    const {data: balance} = useBalance({
        address: '0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e',
    });

    const balancesViem = await client.getBalances({
        address: '0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e',
    })
    // 转装到别的账户
    const {data: hash, sendTransaction} = useSendTransaction();
    const sendEth = () => {
        sendTransaction({
            to: '0x28d9CED9234b5b82A9a02E2B2563BB4C6B7dF942',
            value: parseEther('1')
        })

        const {
            isLoading: isConfirming,
            isSuccess: isConfirmed
        } = useWaitForTransactionReceipt({
            hash: hash,
        })

        console.log(isConfirming, isConfirmed, "result")
    }

    //合约交互---------
    // 读取合约,查看ReadContract.tsx,写入查看WhiteContract.tsx


// 渲染所有可用连接器
    return (
        <div>
            {
                connectors.map(connector => (
                    <button key={connector.id} onClick={() => connect({connector})}>
                        Connect {connector.name}
                    </button>
                ))
            }
            <p>{isConnected && <div>Connected: {address}</div>}</p>
            {/*{*/}
            {/*    isConnected &&*/}
            {/*  <button onClick={() => disconnect()}>disconnect</button>*/}
            {/*}*/}
            <p>chainId:{chainId}</p>
            <h4>资产操作</h4>
            <p>balance:{balance?.formatted}</p>
            <p>
                <button onClick={() => sendEth()}>sendTransaction</button>
            </p>
            <h4>合约交互</h4>
            {/*<p>{isConfirming },{isConfirmed}</p>*/}
        </div>
    )
}