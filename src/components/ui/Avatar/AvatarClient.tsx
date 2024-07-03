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
        href="/perfil"
        className={clsx(
          'text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 block',
          {
            'bg-main text-white hover:bg-main': pathname === '/perfil',
          },
        )}
      >
        Configurações
      </Link>
      <Link
        href="/pedidos"
        className={clsx(
          'text-sm px-4 py-2 text-gray-800 hover:bg-gray-200 block',
          {
            'bg-main text-white hover:bg-main': pathname === '/pedidos',
          },
        )}
      >
        Meus pedidos
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
