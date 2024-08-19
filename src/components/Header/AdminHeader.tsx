'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

import Avatar from '@/components/Avatar'
import { Link, usePathname } from '@/navigation'

export default function AdminHeader() {
  const pathname = usePathname()
  const t = useTranslations('structure')

  return (
    <header className="bg-white border-b w-full shadow-sm">
      <article className="w-[98%] flex justify-between items-center py-4 px-6 mx-auto">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logotipo da Poubelle"
            width={90}
            height={90}
            priority
          />
        </Link>

        <div className="flex gap-4 items-center mr-4">
          <Link
            href={`/admin/dashboard`}
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-primary border-b border-b-main':
                pathname.includes('/admin/dashboard'),
            })}
          >
            {t('header.admin.dashboard')}
          </Link>
          <Link
            href={`/admin/products`}
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-primary border-b border-b-main':
                pathname.includes('/admin/products'),
            })}
          >
            {t('header.admin.products')}
          </Link>
          <Link
            href={`/admin/orders`}
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-primary border-b border-b-main':
                pathname.includes('/admin/orders'),
            })}
          >
            {t('header.admin.orders')}
          </Link>
          <Link
            href={`/admin/campaigns`}
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-primary border-b border-b-main':
                pathname.includes('/admin/campaigns'),
            })}
          >
            {t('header.admin.campaigns')}
          </Link>
          <div className="h-11 flex gap-4 items-center justify-between">
            <Avatar.Root>
              <Avatar.Admin />
            </Avatar.Root>
          </div>
        </div>
      </article>
    </header>
  )
}
