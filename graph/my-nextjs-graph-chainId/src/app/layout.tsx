import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ERC20 DApp with The Graph",
  description:
    "A Next.js DApp for ERC20 token balance checking and transfers using The Graph",
  openGraph: {
    title: "ERC20 DApp with The Graph",
    description:
      "A Next.js DApp for ERC20 token balance checking and transfers using The Graph",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
