import {
  useAccount,
  useBalance,
  useChains,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";

export function useWeb3() {
  const { address, isConnected, chain } = useAccount();
  const getChains = useChains();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    switchChain,
    status: chainStatus,
    isSuccess: chainSuccess,
  } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  return {
    address,
    isConnected,
    balance,
    getChains,
    chain,
    connect,
    connectors,
    disconnect,
    switchChain,
    error,
    chainStatus,
    chainSuccess,
  };
}
