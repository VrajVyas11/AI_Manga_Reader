import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cmdxd98sb0x3yprd.mangadex.network',
      },
      {
        protocol: 'https',
        hostname: 'mangadex.org',
      },
    ],
  },
};

export default nextConfig;
