import { useReadContract } from 'wagmi'
import { wagmiContractConfig } from './contracts'

function ReadContract() {
    const { data: balance } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'balanceOf',
        args: ['0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e'],
    })

    return (
        <div>Balance: {balance?.toString()}</div>
    )
}