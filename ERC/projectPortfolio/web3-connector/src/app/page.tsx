import ConnectButton from '@/components/ConnectButton';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Web3 Connector</h1>
        <ConnectButton className="ceshi"/>
      </div>
    </div>
  );
} 