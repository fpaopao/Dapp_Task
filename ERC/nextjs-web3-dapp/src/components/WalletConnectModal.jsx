// 'use client';
// import { walletConnect } from 'wagmi/connectors';
// import { useConnect } from 'wagmi';
// import {useState,useEffect} from 'react';
//
// export default function WalletConnectModal() {
//   const [uri, setUri] = useState('');
//   const { connect } = useConnect();
//
//   const connector = walletConnect({
//     options: {
//       projectId: '4eee412f87919d54aa6c870ab6eca637',
//       showQrModal: false // 禁用内置二维码弹窗
//     }
//   });
//
//   useEffect(() => {
//     // 监听 URI 生成事件
//     const handleURI = (uri) => {
//       setUri(uri);
//       console.log("收到的 URI:", uri);
//     };
//
//     connector.on('display_uri', handleURI);
//
//     return () => {
//       connector.off('display_uri', handleURI);
//     };
//   }, [connector]);
//
//   const handleConnect = () => {
//     connect({ connector });
//   };
//
//   return (
//     <div>
//       <button onClick={handleConnect}>连接 WalletConnect</button>
//       {uri && (
//         <div>
//           <h3>扫描二维码连接</h3>
//           {/* 使用二维码库显示二维码 */}
//           <QRCode value={uri} />
//         </div>
//       )}
//     </div>
//   );
// }