import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/dpstore',
        destination: 'https://web-six-nu-84.vercel.app/dpstore',
      },
      {
        source: '/dpstore/:path*',
        destination: 'https://web-six-nu-84.vercel.app/dpstore/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'squirrel-pi-nine.vercel.app'],
    },
  },
}

export default nextConfig
