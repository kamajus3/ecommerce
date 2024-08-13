'use client'

import { useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { applyActionCode } from 'firebase/auth'
import { toast } from 'react-toastify'

import Loading from '@/components/ui/Loading'
import { auth } from '@/services/firebase/config'

export default function ChangeEmail({
  params: { code },
}: {
  params: { code: string }
}) {
  const router = useRouter()

  useEffect(() => {
    function handleVerifyEmail() {
      applyActionCode(auth, code)
        .then(() => {
          toast.success('O seu email foi alterado com sucesso')

          setTimeout(() => {
            router.replace('/logout')
          }, 2000)
        })
        .catch(() => {
          notFound()
        })
    }

    handleVerifyEmail()
  }, [router, code])

  return <Loading />
}
