'use client'

import { auth } from '@/config/firebase'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Logout() {
  const { setUserDatabase, setUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    auth
      .signOut()
      .then(() => {
        router.replace('/')
        setUserDatabase(null)
        setUser(null)
      })
      .catch(() => {
        router.replace('/')
      })
  }, [router, setUser, setUserDatabase])
}
