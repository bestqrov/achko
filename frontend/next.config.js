/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'arwapark.digima.cloud', process.env.NEXT_PUBLIC_DOMAIN || 'localhost'],
  },
  // Proxy API calls to the backend (port 5000) so only one port (3000) needs to be exposed
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:5000/api/v1/:path*',
      },
      {
        source: '/health',
        destination: 'http://localhost:5000/health',
      },
    ];
  },
};

module.exports = nextConfig;
