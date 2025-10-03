import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ['puppeteer-core',
    '@sparticuz/chromium',
    'js-clipper',
    'onnxruntime-web',  // Treat as external (assumes installed globally or via env)
    '@techstark/opencv-js',
    'sharp'  // If native issues persis
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
      }
    ],
  },
};


export default nextConfig;

