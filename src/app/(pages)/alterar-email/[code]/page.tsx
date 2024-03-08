'use client'

import Loading from '@/app/components/Loading'
import { auth } from '@/lib/firebase/config'
import { applyActionCode } from 'firebase/auth'
import { notFound, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast, Bounce } from 'react-toastify'

export default function ChangeEmail({ params }: { params: { code: string } }) {
  const router = useRouter()

  useEffect(() => {
    function handleVerifyEmail() {
      applyActionCode(auth, params.code)
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
            router.replace('/')
          }, 2000)
        })
        .catch(() => {
          notFound()
        })
    }

    handleVerifyEmail()
  }, [router, params])

  return <Loading />
}
