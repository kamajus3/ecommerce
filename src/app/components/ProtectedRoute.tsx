'use client'

import { useAuth } from '@/hooks/useAuth'
import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user && pathname === '/admin/login') {
      router.replace('/admin/dashboard')
    }

    if (!user) {
      router.replace('/admin/login')
    }
  }, [user, router, pathname])

  return (
    <>
      {user || pathname === '/admin/login' || pathname === '/admin/logout' ? (
        children
      ) : (
        <p>Carregando...</p>
      )}
    </>
  )
}
