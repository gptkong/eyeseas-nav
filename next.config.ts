import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // 设置图片缓存时间
    minimumCacheTTL: 60 * 60 * 24, // 24 小时
  },
  
  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['lucide-react', '@heroui/react', 'framer-motion'],
  },
  
  // 严格模式
  reactStrictMode: true,
  
  // 输出配置
  output: 'standalone',
};

export default nextConfig;
