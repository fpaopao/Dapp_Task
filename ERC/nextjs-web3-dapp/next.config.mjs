/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // 解决WalletConnect的polyfill问题
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;

// const nextConfig = {
//   reactStrictMode: true,
//   webpack: (config) => {
//     // 解决WalletConnect的polyfill问题
//     config.externals.push('pino-pretty', 'lokijs', 'encoding');
//     config.resolve.fallback = { fs: false, net: false, tls: false };
//     return config;
//   },
// };
//
// module.exports = nextConfig;
