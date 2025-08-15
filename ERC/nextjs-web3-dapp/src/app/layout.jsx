import '@/styles/globals.css';
import Web3Provider from '@/contexts/Web3Provider';

export const metadata = {
  title: 'Web3 DApp with RainbowKit',
  description: 'Next.js DApp with wagmi, viem and RainbowKit',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
