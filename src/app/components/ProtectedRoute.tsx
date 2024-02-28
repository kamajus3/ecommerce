'use client'

import { useAuth } from '@/hooks/useAuth'
import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Loading from './Loading'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user && initialized && pathname === '/admin/login') {
      router.replace('/admin/dashboard')
    }

    if (!user && initialized && pathname !== '/admin/login')
      router.replace('/admin/login')
  }, [user, router, pathname, initialized])

  return (
    <>
      {(user && initialized) || pathname === '/admin/login' ? (
        children
      ) : (
        <Loading />
      )}
    </>
  )
}
