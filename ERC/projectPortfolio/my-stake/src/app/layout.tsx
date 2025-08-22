import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Web3Provider from '@/components/Web3provider';

// const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Next.js Stake Demo",
  description: "响应式Header实现，切换页面不刷新Header",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-white min-h-screen flex flex-col">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
