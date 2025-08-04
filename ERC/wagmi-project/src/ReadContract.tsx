// ReadContract.tsx
import {useReadContract} from "wagmi";
import {erc20Abi} from "viem";

const contractConfig = {
    abi: [
        {
            type: 'function',
            name: 'balanceOf',
            stateMutability: 'view',
            inputs: [{name: 'account', type: 'address'}],
            outputs: [{type: 'uint256'}],
        },
        {
            type: 'function',
            name: 'totalSupply',
            stateMutability: 'view',
            inputs: [],
            outputs: [{name: 'supply', type: 'uint256'}],
        },
    ],
} as const;

export function ReadContract() {
    const {data: balance, isPending} = useReadContract({
        // ...contractConfig,
        abi:erc20Abi,
        address: "0x8622bbab4157926a0afd2c2fd83a8a325bd8fe5e",
        functionName: "balanceOf",
        args: ["0x4265ead2BdDFF1fA27703210Ac72E33827bAa48e"],
    });
    console.log(balance, "balance ")

    if (isPending) return <div>加载中...</div>;
    return <div>余额: {balance?.toString()}</div>;
}