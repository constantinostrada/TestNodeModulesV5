import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enforce correct layer imports at build time where possible
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
