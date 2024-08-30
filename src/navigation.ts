import { createSharedPathnamesNavigation } from 'next-intl/navigation'

import constants from '@/constants'

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales: constants.locales })
