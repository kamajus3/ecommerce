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
    if (!user) {
      router.replace('/admin/login')
    }
  }, [user, router])

  return (
    <>{user || pathname === '/admin/login' ? children : <p>Carregando...</p>}</>
  )
}
