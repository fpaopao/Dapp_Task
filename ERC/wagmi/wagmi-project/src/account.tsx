import {useAccount, useDisconnect, useEnsAvatar, useEnsName,useBalance} from 'wagmi'
import {ReadContract} from "./ReadContract.tsx";
import {WirteContract} from "./WirteContract.tsx";

export function Account() {
    // 获取当前链接账户的地址，链ID 和链接状态
    const {address, chainId, isConnected} = useAccount()
    const {disconnect} = useDisconnect()
    const {data: ensName} = useEnsName({address})
    const {data: ensAvatar} = useEnsAvatar({name: ensName!})
    const {data:ba} = useBalance({
        address: '0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e',
    })
    console.log(ba,"ba")

    return (
        <div>
            {ensAvatar && <img alt="ENS Avatar" src={ensAvatar}/>}
            {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
            <button onClick={() => disconnect()}>Disconnect</button>
            ----
            <p>useAccount-chainId:{chainId}---{isConnected}</p>
            <p>useBalance:{ba&&ba.symbol}</p>
            ----
            <p><ReadContract/></p>
            <p><WirteContract/></p>
        </div>
    )
}