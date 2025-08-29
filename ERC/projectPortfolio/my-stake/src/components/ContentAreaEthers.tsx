"use client";
import { usePathname } from "next/navigation";
import HomeEthers from "@/components/HomeEthers"
import WithdrawEthers from "@/components/WithdrawEthers"
const ContentArea = () => {
  const pathname = usePathname();

  // 根据路径显示不同内容
  const getContent = () => {
    switch (pathname) {
      case "/ethers/withdraw":
        return <WithdrawEthers />
      case "/ethers":
        return <HomeEthers />
      default: // 首页
        return null
    }
  };

  return <div className="pt-16 pb-12">{getContent()}</div>;
};

export default ContentArea;
