import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export for custom server compatibility
  // output: 'export', // Commented out for custom server
  
  // Configurações de imagem
  images: {
    unoptimized: true,
  },
  
  reactStrictMode: false,
};

export default nextConfig;
