/** @type {import('next').NextConfig} */

const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_INFURA_IPFS_API_KEY:
      process.env.NEXT_PUBLIC_INFURA_IPFS_API_KEY,
    NEXT_PUBLIC_INFURA_IPFS_API_SECRET:
      process.env.NEXT_PUBLIC_INFURA_IPFS_API_SECRET,
    NEXT_PUBLIC_MIXPANEL_PROJECT_KEY:
      process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_KEY,
    NEXT_PUBLIC_MIXPANEL_HOST: process.env.NEXT_PUBLIC_MIXPANEL_HOST,
    NEXT_PUBLIC_DEFIOS_SERVER: process.env.NEXT_PUBLIC_DEFIOS_SERVER,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});
module.exports = nextConfig;
module.exports = {
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'raw.githubusercontent.com',
      'foresight.org',
      'gateway.pinata.cloud',
      'ipfs.io',
      'fuchsia-evolutionary-marlin-251.mypinata.cloud',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
