import { useMetaNodeStake } from "@/hooks/useContract";
import { useState } from "react"
import { useAccount } from 'wagmi'
import { formatUnits } from 'viem';

export default function Home() {
  const { address, isConnected } = useAccount();
  const {stakeBalance } = useMetaNodeStake();
  const [StakedBalance, setStakedBalance] = useState(0);
  if (!address || !isConnected) {
    return;
  }

  
  console.log("🚀 ~ Home ~ stakeBalance:", stakeBalance)

  // let getStakingBalanceOf = getStakingBalance(address)
  // console.log("🚀 ~ Home ~ getStakingBalanceOf:", getStakingBalanceOf)





  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
        stake
        <div>
          {/* <h3 onClick={() => { test() }}>测试</h3>
          <h3 onClick={() => { addTest() }}>addTest</h3> */}
          <p>StakedBalance:{StakedBalance}</p>
        </div>
      </h1>



      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">实现功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "无刷新切换",
              desc: "切换页面时只更新内容区，Header保持原样",
              icon: "🔄",
            },
            {
              title: "响应式设计",
              desc: "完美适配 PC 和移动设备",
              icon: "📱",
            },
            {
              title: "移动端优化",
              desc: "移动设备上使用下拉菜单导航",
              icon: "📲",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">使用说明</h2>
        <ol className="text-left space-y-4">
          <li className="flex">
            <div
              className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              1
            </div>
            <p>
              在 PC 端点击上方导航标签，观察内容变化而 Header 保持不变
            </p>
          </li>
          <li className="flex">
            <div
              className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              2
            </div>
            <p>在移动端点击右上角菜单图标，展开下拉菜单进行导航</p>
          </li>
          <li className="flex">
            <div
              className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              3
            </div>
            <p>滚动页面观察 Header 的动画效果变化</p>
          </li>
        </ol>
      </div>
    </div>
  );
}

