'use client'

import { useAuth } from '@/hooks/useAuth'
import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Loading from './Loading'

interface ProtectedRouteProps {
  children: ReactNode
  privileges?: string[]
  pathWhenAuthorizated?: string
  pathWhenNotAuthorizated?: string
}

export default function ProtectedRoute({
  children,
  privileges = ['admin'],
  pathWhenAuthorizated = '/admin/dashboard',
  pathWhenNotAuthorizated = '/admin/login',
}: ProtectedRouteProps) {
  const { user, userDB, initialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  function checkPrivileges(
    userPrivileges: string[],
    requiredPrivileges: string[],
  ) {
    for (let i = 0; i < requiredPrivileges.length; i++) {
      if (!userPrivileges.includes(requiredPrivileges[i])) {
        return false
      }
    }

    return true
  }

  useEffect(() => {
    if (userDB && user && privileges && initialized) {
      const userIsValid = checkPrivileges(userDB.privileges, privileges)

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
    privileges,
  ])

  return (
    <>
      {(userDB &&
        user &&
        checkPrivileges(userDB.privileges, privileges) &&
        initialized) ||
      pathname === pathWhenNotAuthorizated ? (
        children
      ) : (
        <Loading />
      )}
    </>
  )
}
