import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    transpilePackages: ['antd'],
    compiler: {
        styledComponents: true
    }
};

export default nextConfig;
