import {useWriteContract} from "wagmi";
import {erc20Abi} from "viem";

export function WirteContract() {
    const {writeContract} = useWriteContract()

    const transferBtn = () => {
        let a = writeContract({
            abi: erc20Abi,
            address: '0x8622bbab4157926a0afd2c2fd83a8a325bd8fe5e',
            functionName: 'transfer',
            args: [
                '0x28d9CED9234b5b82A9a02E2B2563BB4C6B7dF942',
                123n,
            ],
        })
        console.log(a)
    }

    return (
        <div>
            <button onClick={() => transferBtn()}>WriteS</button>
        </div>
    )

}