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
    <div className="text-[15px] font-medium text-gray-800">
      <p
        className={clsx('px-4 py-2 border-b', {
          hidden: !user,
        })}
      >
        {t('header.loggedIn')} <strong>{user?.email}</strong>
      </p>
      <Link
        href="/login"
        className={clsx('px-4 py-2 hover:bg-gray-200 block', {
          'bg-primary text-white hover:bg-primary': pathname === '/settings',
          hidden: user,
        })}
      >
        {t('header.client.login')}
      </Link>
      <Link
        href="/settings"
        className={clsx('px-4 py-2 hover:bg-gray-200 block', {
          'bg-primary text-white hover:bg-primary': pathname === '/settings',
          hidden: !user,
        })}
      >
        {t('header.client.settings')}
      </Link>
      <Link
        href="/orders"
        className={clsx('px-4 py-2 hover:bg-gray-200 block', {
          'bg-primary text-white hover:bg-primary': pathname === '/orders',
          hidden: !user,
        })}
      >
        {t('header.client.orders')}
      </Link>
      <Link
        href="/logout"
        className={clsx('block px-4 py-2 hover:bg-gray-200', {
          hidden: !user,
        })}
      >
        {t('header.logout')}
      </Link>
    </div>
  )
}
