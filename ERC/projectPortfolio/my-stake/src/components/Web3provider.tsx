'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/config/wagmi';
import Header from "@/components/Header"
import HeaderEthers from "@/components/HeaderEthers"
import { Toaster } from 'react-hot-toast';
import { usePathname } from "next/navigation";
const queryClient = new QueryClient();

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
   const pathname = usePathname();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {
            pathname.indexOf("/ethers")>-1 ?<HeaderEthers/>:<Header />
          }
          <main className="flex-grow container mx-auto px-4 py-8 mainbody">
            <Toaster
              position="top-right"
              expand={false}
              richColors
              closeButton
              theme="system" // 支持 system, light, dark
              duration={4000}
              visibleToasts={5}
              id="single"
              offset={160}
              toastOptions={{
                // 全局样式
                style: {
                  background: '#eef2ff ',
                  color: '#3498db',
                  border: '1px solid hsl(var(--border))',
                  marginTop: '80px'
                },
              }}
            />
            {children}
          </main>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
