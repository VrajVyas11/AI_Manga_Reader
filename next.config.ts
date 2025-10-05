// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [
    'puppeteer-core',
    '@sparticuz/chromium',
    'sharp',
    '@techstark/opencv-js',
    'js-clipper',
  ],
  transpilePackages: [
    'onnxruntime-web'
  ],
  turbopack: {},
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cmdxd98sb0x3yprd.mangadex.network',
      },
      {
        protocol: 'https',
        hostname: 'mangadex.org',
      },
      {
        protocol: 'https',
        hostname: 'og.mangadex.org'
      },
      {
        protocol: "https",
        hostname: "uploads.mangadex.org"
      },
      {
        protocol: "https",
        hostname: "forums.mangadex.org"
      }
    ],
  },
  
  // Add performance headers
  async headers() {
    return [
      {
        source: '/api/manga/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(process.cwd(), 'node_modules/onnxruntime-web/dist/*.wasm'),
              to: 'wasm/[name][ext]',
              noErrorOnMissing: true,
            },
            {
              from: path.join(process.cwd(), 'node_modules/onnxruntime-web/dist/*.mjs'),
              to: 'wasm/[name][ext]',
              noErrorOnMissing: true,
            },
            {
              from: path.join(process.cwd(), 'scripts/models/*.onnx'),
              to: 'scripts/models/[name][ext]',
              noErrorOnMissing: true,
            },
            {
              from: path.join(process.cwd(), 'scripts/models/*.txt'),
              to: 'scripts/models/[name][ext]',
              noErrorOnMissing: true,
            },
          ],
        })
      );
    }
    return config;
  },
};

export default nextConfig;