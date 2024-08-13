'use client'

import { useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { applyActionCode } from 'firebase/auth'
import { toast } from 'react-toastify'

import Loading from '@/components/ui/Loading'
import { auth } from '@/services/firebase/config'

export default function ConfirmEmail({
  params: { code },
}: {
  params: { code: string }
}) {
  const router = useRouter()

  useEffect(() => {
    function handleVerifyEmail() {
      applyActionCode(auth, code)
        .then(() => {
          toast.success('Email confirmado com sucesso')

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
