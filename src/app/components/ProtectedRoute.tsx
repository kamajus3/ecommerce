'use client'

import { useAuth } from '@/hooks/useAuth'
import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Loading from './Loading'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { userDB, initialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (userDB) {
      const userIsValid = 'admin' in userDB?.privileges

      if (userIsValid && initialized && pathname === '/admin/login') {
        router.replace('/admin/dashboard')
      }

      if (!userIsValid && initialized && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
    } else {
      if (!userDB && initialized && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
    }
  }, [userDB, router, pathname, initialized])

  return (
    <>
      {(userDB && initialized) || pathname === '/admin/login' ? (
        children
      ) : (
        <Loading />
      )}
    </>
  )
}
