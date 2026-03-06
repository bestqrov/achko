/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'arwapark.digima.cloud', process.env.NEXT_PUBLIC_DOMAIN || 'localhost'],
  },
};

module.exports = nextConfig;
