/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com']
  },
  env: {
    APP_NAME: 'SevaLink',
    APP_VERSION: '1.0.0'
  }
};

module.exports = nextConfig; 