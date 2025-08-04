import * as React from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions() {
    // 用于连接钱包供应商，返回链接状态和可用的连接器列表
    const { connectors, connect } = useConnect()
    console.log(connectors, "connectors")
    return connectors.map((connector) => (
        <WalletOption
            key={connector.uid}
            connector={connector}
            onClick={() => connect({ connector })}
        />
    ))
}

function WalletOption({
    connector,
    onClick,
}: {
    connector: Connector
    onClick: () => void
}) {
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        ; (async () => {
            const provider = await connector.getProvider()
            setReady(!!provider)
        })()
    }, [connector])

    return (
        <button disabled={!ready} onClick={onClick}>
            {connector.name}
        </button>
    )
}