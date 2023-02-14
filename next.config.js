/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['pages', 'utils'], // Only run ESLint on the 'pages' and 'utils' directories during production builds
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    NEXT_PUBLIC_RANDOM_SECRET: process.env.NEXT_PUBLIC_RANDOM_SECRET,
  },
}

module.exports = nextConfig
