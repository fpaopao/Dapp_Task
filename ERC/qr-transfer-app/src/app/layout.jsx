'use client';
import {config} from '@/config/web3';
import {WagmiProvider} from 'wagmi';
import {RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({children}) {
  return (
    <html lang="en">
    <body className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#7b3fe4',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </body>
    </html>
  );
}