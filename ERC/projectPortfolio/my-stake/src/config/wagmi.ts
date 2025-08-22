import {getDefaultConfig} from '@rainbow-me/rainbowkit';
import {http} from 'viem';
import {sepolia} from 'wagmi/chains';

const ProjectId = '4eee412f87919d54aa6c870ab6eca637'

export const config = getDefaultConfig({
  appName: 'myStake',
  projectId: ProjectId,
  chains: [
    sepolia
  ],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.public.blastapi.io')
  },
  ssr: true,
});

export const defaultChainId: number = sepolia.id