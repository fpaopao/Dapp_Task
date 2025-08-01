import {WagmiProvider, useAccount} from 'wagmi'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {config} from './config'
import {Account} from './account'
import {WalletOptions} from './wallet-options'

import {IndexPage} from "./testFun/index.tsx"
import {ReadContract} from "./ReadContract.tsx";
import {WirteContract} from "./WirteContract.tsx";

const queryClient = new QueryClient()

function ConnectWallet() {
    const {isConnected} = useAccount()
    if (isConnected) return <Account/>
    return <WalletOptions/>
}

function App() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {/*<Profile/>*/}
                <br/>
                <ConnectWallet/>
                {/*<ReadContract/>*/}
                {/*<WirteContract/>*/}
                <br/>
                {/*<IndexPage/>*/}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default App;