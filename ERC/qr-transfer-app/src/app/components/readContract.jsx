'use client'
import {readContractBalanceOf} from "@/contracts/tokenContract1";
import {useState} from "react";
import {useAccount} from "wagmi";

export default function ReadContract() {
  const [balance, setBalance] = useState(0);
  const {address} = useAccount();


  const getBalanceBtn = async () => {
    const balance = await readContractBalanceOf(address);
    setBalance(balance);
  }

  return (
    <>
      <button onClick={() => getBalanceBtn()}>getBalance</button>
      <br/>
      <p>Balance:{balance}</p>
    </>
  )
}