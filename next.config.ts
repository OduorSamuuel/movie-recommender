import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add any required configuration here
  transpilePackages: ['videojs-youtube'], 
  webpack: (config) => {
    // This helps ensure CSS from node_modules is processed correctly
    return config;
  }
};

export default nextConfig;