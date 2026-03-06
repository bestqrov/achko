/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', process.env.NEXT_PUBLIC_DOMAIN || 'localhost'],
  },
};

module.exports = nextConfig;
