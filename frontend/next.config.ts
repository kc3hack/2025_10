import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      '202502-test-bucket.s3.ap-northeast-1.amazonaws.com',
    ],
  },
};

export default nextConfig;
