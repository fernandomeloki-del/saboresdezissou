/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // PWA Configuration
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  }
};

export default nextConfig;