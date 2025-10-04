import type { NextConfig } from 'next';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const nextConfig: NextConfig = {
  output: "standalone",
  // Remove the entire webpack section - not needed for Docker
  serverExternalPackages: [
    'puppeteer-core',
    '@sparticuz/chromium',
    'sharp',
    '@techstark/opencv-js',
    'js-clipper'
  ],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
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
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            // Copy WASM binaries
            {
              from: path.join(process.cwd(), 'node_modules/onnxruntime-web/dist/*.wasm'),
              to: 'wasm/[name][ext]',
              noErrorOnMissing: true, // Ignore if files missing (dev safety)
            },
            // Copy ONNX models
            {
              from: path.join(process.cwd(), 'scripts/models/*.onnx'),
              to: 'scripts/models/[name][ext]',
              noErrorOnMissing: true,
            },
            // Copy dictionary files
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