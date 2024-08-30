'use client'

import { ReactNode, useEffect } from 'react'

import { EnumUserRole } from '@/@types'
import Loading from '@/components/Loading'
import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from '@/navigation'
import useUserStore from '@/store/UserStore'

interface IProtectedRoute {
  children: ReactNode
  role?: EnumUserRole
  pathWhenAuthorizated: string
  pathWhenNotAuthorizated: string
}

export default function ProtectedRoute({
  children,
  role = 'admin',
  pathWhenNotAuthorizated,
  pathWhenAuthorizated,
}: IProtectedRoute) {
  const user = useUserStore((state) => state.metadata)
  const userDB = useUserStore((state) => state.data)
  const { initialized } = useAuth()

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
