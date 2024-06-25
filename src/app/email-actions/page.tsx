'use client'

import { useSearchParams, useRouter } from 'next/navigation'

import Loading from '@/components/Loading'
import { Suspense, useEffect } from 'react'

function EmailActions() {
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
        case 'verifyAndChangeEmail':
          router.replace(`/alterar-email/${actionCode}`)
          break
        case 'recoverEmail':
          break
        default:
      }
    } else {
      router.replace('/')
    }
  }, [router, mode, actionCode])

  return <Loading />
}

export default function EmailActionSuspenseBoundary() {
  return (
    <Suspense fallback={<Loading />}>
      <EmailActions />
    </Suspense>
  )
}
