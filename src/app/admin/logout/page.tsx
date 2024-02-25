'use client'

import { auth } from '@/lib/firebase/config'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Logout() {
  const { setUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    auth
      .signOut()
      .then(() => {
        router.replace('/')
        setUser(null)
      })
      .catch(() => {
        router.replace('/')
      })
  }, [router, setUser])
}
