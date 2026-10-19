/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: { unoptimized: true },
  basePath: "/admin",
  assetPrefix: "/admin",
  allowedDevOrigins: ["localhost:3000", "127.0.0.1:3000"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
