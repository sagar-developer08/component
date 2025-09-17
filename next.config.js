/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'api.builder.io',
      'example.com',
      'backendcatalog.qliq.ae',
      'images.unsplash.com',
      'picsum.photos'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'backendcatalog.qliq.ae',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
