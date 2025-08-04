import { createConfig, http } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

import { defineChain } from 'viem'

export const ganacheChain = defineChain({
    id: 1337,
    name: 'Ganache',
    nativeCurrency: {
        name: 'Ether',
        decimals: 18,
        symbol: 'ETH'
    },
    rpcUrls: {
        default: {
            http: ['http://localhost:5777'] // 默认RPC端口
        }
    }
})

const projectId = '';//需要官网申请

export const config = createConfig({
    chains: [mainnet, base, ganacheChain],
    connectors: [
        injected(),
        walletConnect({ projectId }),
        metaMask(),
        safe(),
    ],
    ssr: true,
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [ganacheChain.id]: http()
    },
})