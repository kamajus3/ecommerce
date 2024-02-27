'use client'

import Avatar from '@/app/components/Avatar'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <article className="w-screen flex sm:flex justify-between items-center px-4 py-4">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logotipo da Racius Care"
            width={90}
            height={90}
          />
        </Link>

        <div className="flex gap-4 items-center mr-4">
          <Link
            href="/admin/analytics"
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-main border-b border-b-main':
                pathname === '/admin/analytics',
            })}
          >
            Analytics
          </Link>
          <Link
            href="/admin/sells"
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-main border-b border-b-main': pathname === '/admin/sells',
            })}
          >
            Vendas
          </Link>
          <Link
            href="/admin/products"
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-main border-b border-b-main':
                pathname === '/admin/products',
            })}
          >
            Productos
          </Link>
          <Link
            href="/admin/promotions"
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-main border-b border-b-main':
                pathname === '/admin/promotions',
            })}
          >
            Campanhas
          </Link>
          <div className="h-11 flex gap-4 items-center justify-between">
            <Avatar />
          </div>
        </div>
      </article>
    </header>
  )
}
