'use client'

import { ReactNode, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { UserRole } from '@/@types'
import Loading from '@/components/ui/Loading'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  role?: UserRole
  pathWhenAuthorizated?: string
  pathWhenNotAuthorizated?: string
}

export default function ProtectedRoute({
  children,
  role = 'admin',
  pathWhenAuthorizated = '/admin/dashboard',
  pathWhenNotAuthorizated = '/admin/login',
}: ProtectedRouteProps) {
  const { user, userDB, initialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (userDB && user && role && initialized) {
      const userIsValid = role === userDB.role

      if (userIsValid && pathname === pathWhenNotAuthorizated) {
        router.replace(pathWhenAuthorizated)
      }

      if (!userIsValid && pathname !== pathWhenNotAuthorizated) {
        router.replace(pathWhenNotAuthorizated)
      }
    }

    if (!user && initialized && pathname !== pathWhenNotAuthorizated) {
      router.replace(pathWhenNotAuthorizated)
    }
  }, [
    pathWhenAuthorizated,
    pathWhenNotAuthorizated,
    userDB,
    user,
    router,
    pathname,
    initialized,
    role,
  ])

  return (
    <>
      {(userDB && user && role === userDB.role && initialized) ||
      pathname === pathWhenNotAuthorizated ? (
        children
      ) : (
        <Loading />
      )}
    </>
  )
}
