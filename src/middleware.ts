import createMiddleware from 'next-intl/middleware'

import constants from '@/constants'

export default createMiddleware({
  // A list of all locales that are supported
  locales: constants.locales,

  // Used when no locale matches
  defaultLocale: 'en',
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en)/:path*'],
}
