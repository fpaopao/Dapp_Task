"use client";
import { usePathname } from "next/navigation";
import Home from "@/components/Home"
const ContentArea = () => {
  const pathname = usePathname();

  // 根据路径显示不同内容
  const getContent = () => {
    switch (pathname) {
      case "/products":
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">产品中心</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              探索我们的创新产品线，专为解决您的业务挑战而设计。
              从企业级解决方案到个人生产力工具，我们提供全方位的产品选择。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">产品 {item}</h3>
                  <p className="text-gray-600">
                    产品描述内容在这里，详细介绍产品的功能和优势。
                  </p>
                  <button className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                    了解更多
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default: // 首页
        return <Home />
    }
  };

  return <div className="pt-16 pb-12">{getContent()}</div>;
};

export default ContentArea;
