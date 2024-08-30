import { fileURLToPath } from 'node:url'

import createJiti from 'jiti'
import createNextIntlPlugin from 'next-intl/plugin'

const locales = ['en', 'fr']

const jiti = createJiti(fileURLToPath(import.meta.url))

const withNextIntl = createNextIntlPlugin()

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti('./src/env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  async redirects() {
    return locales.map((locale) => ({
      source: `/${locale}/admin`,
      destination: `/${locale}/admin/dashboard`,
      permanent: true,
    }))
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
