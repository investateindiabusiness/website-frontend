/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dev.investateindia.api.brvteck.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
