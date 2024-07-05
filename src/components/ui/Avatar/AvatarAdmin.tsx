'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import useUserStore from '@/store/UserStore'

export default function Avatar() {
  const pathname = usePathname()
  const user = useUserStore((state) => state.metadata)

  return (
    <div>
      <p className="text-sm px-4 py-2 text-gray-800 border-b">
        Logado em <strong>{user?.email}</strong>
      </p>
      <Link
        href="/admin/dashboard"
        className={clsx(
          'hidden text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 max-sm:block',
          {
            'bg-main text-white hover:bg-main': pathname === '/admin/dashboard',
          },
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/admin/productos"
        className={clsx(
          'hidden text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 max-sm:block',
          {
            'bg-main text-white hover:bg-main': pathname === '/admin/productos',
          },
        )}
      >
        Produtos
      </Link>
      <Link
        href="/admin/pedidos"
        className={clsx(
          'hidden text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 max-sm:block',
          {
            'bg-main text-white hover:bg-main': pathname === '/admin/pedidos',
          },
        )}
      >
        Pedidos
      </Link>
      <Link
        href="/admin/campanhas"
        className={clsx(
          'hidden text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 max-sm:block',
          {
            'bg-main text-white hover:bg-main': pathname === '/admin/campanhas',
          },
        )}
      >
        Campanhas
      </Link>
      <Link
        href="/"
        className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
      >
        Voltar ao front-office
      </Link>
      <Link
        href="/logout"
        className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
      >
        Terminar sessão
      </Link>
    </div>
  )
}
