'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css'

export default function CustomConnectButton() {
  return (
    <ConnectButton
      showBalance={false}
      accountStatus="full"
      chainStatus="icon"
      label="Connect Wallet"
    />
  );
}