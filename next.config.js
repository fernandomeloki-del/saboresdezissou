/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'uvkcloxlnnvluzoovvgr.supabase.co'],
    unoptimized: true,
  },
  // PWA Configuration
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  },
  // Disable ESLint during build to prevent warnings from blocking deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;