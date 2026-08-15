/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
