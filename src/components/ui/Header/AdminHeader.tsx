'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import Avatar from '@/components/ui/Avatar'

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
            priority
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
            href="/admin/productos"
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-main border-b border-b-main':
                pathname === '/admin/productos',
            })}
          >
            Productos
          </Link>
          <Link
            href="/admin/pedidos"
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-main border-b border-b-main': pathname === '/admin/pedidos',
            })}
          >
            Pedidos
          </Link>
          <Link
            href="/admin/campanhas"
            className={clsx('font-medium text-black max-sm:hidden', {
              'text-main border-b border-b-main':
                pathname === '/admin/campanhas',
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
