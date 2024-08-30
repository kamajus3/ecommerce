'use client'

import { useEffect } from 'react'
import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { applyActionCode } from 'firebase/auth'
import { toast } from 'react-toastify'

import Loading from '@/components/Loading'
import { useRouter } from '@/navigation'
import { auth } from '@/services/firebase/config'

export default function ConfirmEmail({
  params: { code },
}: {
  params: { code: string }
}) {
  const t = useTranslations('auth')
  const router = useRouter()

  useEffect(() => {
    function handleVerifyEmail() {
      applyActionCode(auth, code)
        .then(() => {
          toast.success(t('confirmEmail.successful'))

          setTimeout(() => {
            router.replace('/logout')
          }, 2000)
        })
        .catch(() => {
          notFound()
        })
    }

    handleVerifyEmail()
  }, [router, code, t])

  return <Loading />
}
