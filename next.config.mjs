const rawBasePath = process.env.BASE_PATH?.trim() || '';
const basePath = rawBasePath && rawBasePath !== '/'
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
  : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  basePath,
  devIndicators: false,
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_ASSET_BASE_URL
      ? [new URL(`${process.env.NEXT_PUBLIC_ASSET_BASE_URL.replace(/\/+$/, '')}/**`)]
      : [],
  },
};

export default nextConfig;
