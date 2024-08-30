'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { AuthError, checkActionCode, confirmPasswordReset } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Field from '@/components/Field'
import Header from '@/components/Header'
import Loading from '@/components/Loading'
import { useRouter } from '@/navigation'
import { auth } from '@/services/firebase/config'
import { zodResolver } from '@hookform/resolvers/zod'

interface IFormData {
  password: string
  confirmPassword: string
}

export default function ChangePassword({
  params: { code },
}: {
  params: { code: string }
}) {
  const t = useTranslations()

  const schema = z
    .object({
      password: z
        .string()
        .min(
          6,
          t('form.errors.minLength', {
            field: `${t('auth.sharedFields.password').toLowerCase()}`,
            length: 6,
          }),
        )
        .max(
          40,
          t('form.errors.maxLength', {
            field: `${t('auth.sharedFields.password').toLowerCase()}`,
            length: 40,
          }),
        ),
      confirmPassword: z
        .string()
        .min(
          6,
          t('form.errors.minLength', {
            field: `${t('auth.sharedFields.password').toLowerCase()}`,
            length: 6,
          }),
        )
        .max(
          40,
          t('form.errors.maxLength', {
            field: `${t('auth.sharedFields.password').toLowerCase()}`,
            length: 40,
          }),
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('form.errors.passwordsNotSimilar'),
      path: ['confirmPassword'],
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({ resolver: zodResolver(schema) })

  const [loading, setLoading] = useState(true)
  const router = useRouter()

  function onSubmit(data: IFormData) {
    confirmPasswordReset(auth, code, data.password)
      .then(() => {
        toast.success(t('auth.changePassword.successful'))

        setTimeout(() => {
          router.replace('/')
        }, 2000)
      })
      .catch((e: AuthError) => {
        let errorMessage = ''
        if (e.code === 'auth/expired-action-code') {
          errorMessage = t(
            `auth.changePassword.errors.${e.code.replace('auth/', '')}`,
          )
        } else if (e.code === 'auth/invalid-action-code') {
          errorMessage = t(
            `auth.changePassword.errors.${e.code.replace('auth/', '')}`,
          )
        } else if (e.code === 'auth/user-disabled') {
          errorMessage = t(
            `auth.changePassword.errors.${e.code.replace('auth/', '')}`,
          )
        } else {
          errorMessage = t('auth.changePassword.errors.other-error')
        }

        toast.error(errorMessage)
      })
  }

  useEffect(() => {
    checkActionCode(auth, code)
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        notFound()
      })
  }, [code])

  return loading ? (
    <Loading />
  ) : (
    <section className="bg-white min-h-screen">
      <Header.Client />

      <article className="flex justify-center items-center py-32">
        <div className="space-y-6 text-gray-600 max-w-md max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">
            {t('auth.changePassword.title')}
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Field.Label htmlFor="email">
                {t('auth.sharedFields.password')}
              </Field.Label>
              <Field.Input
                type="password"
                {...register('password')}
                error={errors.password}
              />
              <Field.Error error={errors.password} />
            </div>
            <div>
              <Field.Label htmlFor="confirmPassword">
                {t('auth.sharedFields.confirmPassword')}
              </Field.Label>
              <Field.Input
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword}
              />
              <Field.Error error={errors.confirmPassword} />
            </div>

            <button
              type="submit"
              className="w-full rounded px-4 py-2 text-white font-medium bg-primary hover:brightness-90 active:brightness-70 duration-150"
            >
              {t('auth.changePassword.action')}
            </button>
          </form>
        </div>
      </article>
    </section>
  )
}
