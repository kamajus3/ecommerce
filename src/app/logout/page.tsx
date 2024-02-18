'use client'

import { auth } from '@/config/firebase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    auth
      .signOut()
      .then(() => {
        router.replace('/')
      })
      .catch(() => {
        router.replace('/')
      })
  }, [router])
}
