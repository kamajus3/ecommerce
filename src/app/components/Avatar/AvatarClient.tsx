'use client'

import { useAuth } from '@/hooks/useAuth'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Avatar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div>
      <p className="text-sm px-4 py-2 text-gray-800 border-b">
        Logado em <strong>{user?.email}</strong>
      </p>
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
        href="/admin/logout"
        className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
      >
        Terminar sessão
      </Link>
    </div>
  )
}
