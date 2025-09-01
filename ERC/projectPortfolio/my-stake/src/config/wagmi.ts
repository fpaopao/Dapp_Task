import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { sepolia } from 'wagmi/chains';

export const tokenAddress = "0x4104b3D5F60D682a51Bd7d33e467249F10727263";
const ProjectId = '4eee412f87919d54aa6c870ab6eca637'
export const walletAddress = "0x3623843CB3685FDF05a808c4088b0AAFCB54d33a"

export const config = getDefaultConfig({
  appName: 'myStake',
  projectId: ProjectId,
  chains: [
    sepolia
  ],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.api.onfinality.io/public')
  },
  ssr: true,
});

export const defaultChainId: number = sepolia.id