'use client'

import { useSearchParams } from 'next/navigation'

import Loading from '@/app/components/Loading'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function EmailActions() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const mode = searchParams.get('mode')
  const actionCode = searchParams.get('oobCode')

  useEffect(() => {
    if (mode && actionCode) {
      switch (mode) {
        case 'resetPassword':
          router.replace(`/alterar-senha/${actionCode}`)
          break
        case 'recoverEmail':
          break
        case 'verifyEmail':
          break
        default:
      }
    } else {
      router.replace('/')
    }
  }, [router, mode, actionCode])

  return <Loading />
}
