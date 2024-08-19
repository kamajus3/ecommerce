'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

import { Link, usePathname } from '@/navigation'
import useUserStore from '@/store/UserStore'

export default function Avatar() {
  const pathname = usePathname()
  const user = useUserStore((state) => state.metadata)
  const t = useTranslations('structure')

  return (
    <div>
      <p className="text-sm px-4 py-2 text-gray-800 border-b">
        {t('header.loggedIn')} <strong>{user?.email}</strong>
      </p>
      <Link
        href={`/admin/dashboard`}
        className={clsx(
          'hidden text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 max-sm:block',
          {
            'bg-primary text-white hover:bg-primary':
              pathname.includes('/admin/dashboard'),
          },
        )}
      >
        {t('header.admin.dashboard')}
      </Link>
      <Link
        href={`/admin/products`}
        className={clsx(
          'hidden text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 max-sm:block',
          {
            'bg-primary text-white hover:bg-primary':
              pathname.includes('/admin/products'),
          },
        )}
      >
        {t('header.admin.products')}
      </Link>
      <Link
        href={`/admin/orders`}
        className={clsx(
          'hidden text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 max-sm:block',
          {
            'bg-primary text-white hover:bg-primary':
              pathname.includes('/admin/orders'),
          },
        )}
      >
        {t('header.admin.orders')}
      </Link>
      <Link
        href={`/admin/campaigns`}
        className={clsx(
          'hidden text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 max-sm:block',
          {
            'bg-primary text-white hover:bg-primary':
              pathname.includes('/admin/campaigns'),
          },
        )}
      >
        {t('header.admin.campaigns')}
      </Link>
      <Link
        href="/"
        className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
      >
        {t('header.admin.backToClient')}
      </Link>
      <Link
        href={`/logout`}
        className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
      >
        {t('header.logout')}
      </Link>
    </div>
  )
}
