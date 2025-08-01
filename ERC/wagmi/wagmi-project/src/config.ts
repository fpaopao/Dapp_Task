import {http, createConfig} from 'wagmi'
import {base, mainnet, optimism} from 'wagmi/chains'
import {injected, metaMask, safe, walletConnect} from 'wagmi/connectors'

import { defineChain } from 'viem'

const ganacheChain = defineChain({
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

const projectId = '0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e';

export const config = createConfig({
    chains: [mainnet, base,ganacheChain],
    connectors: [
        injected(),
        walletConnect({projectId}),
        metaMask(),
        safe(),
    ],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [ganacheChain.id]: http()
    },
})