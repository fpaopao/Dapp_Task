"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton ,Connector } from "@ant-design/web3";
import styles from "./styles.module.css";

export default function WtfHeader() {
  const pathname = usePathname();
  const currentPath = pathname || "";

  const navItems = [
    { path: "/wtfswap", label: "Swap" },
    { path: "/wtfswap/pool", label: "Pool" },
  ];

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Swap</h1>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={currentPath === item.path ? styles.active : ""}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.connectButton}>
        <Connector
          modalProps={{
            mode: "normal",
          }}
        >
          <ConnectButton />
        </Connector>
      </div>
    </header>
  );
}
