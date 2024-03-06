'use client'

import Avatar from '@/app/components/Avatar'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b w-full shadow-sm">
      <article className="w-[98%] flex justify-between items-center py-4 px-6 mx-auto">
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
            href="/admin/dashboard"
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-main border-b border-b-main':
                pathname === '/admin/dashboard',
            })}
          >
            Dashboard
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
            href="/admin/orders"
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-main border-b border-b-main': pathname === '/admin/orders',
            })}
          >
            Pedidos
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
            <Avatar.Root>
              <Avatar.Admin />
            </Avatar.Root>
          </div>
        </div>
      </article>
    </header>
  )
}
