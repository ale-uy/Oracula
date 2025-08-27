/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Aseguramos que Next.js pueda servir imágenes estáticas desde /public
  assetPrefix: undefined,
  webpack: (config) => {
    // Optimizaciones para docker
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

module.exports = nextConfig
