'use client'

import { useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { applyActionCode } from 'firebase/auth'
import { Bounce, toast } from 'react-toastify'

import Loading from '@/components/ui/Loading'
import { auth } from '@/lib/firebase/config'

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
          toast.success('O seu email foi alterado com sucesso', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          })

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
