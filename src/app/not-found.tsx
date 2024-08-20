'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import Loading from '@/components/Loading'

export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    router.replace(`/en/${pathname}`)
  }, [router, pathname])

  return <Loading />
}
