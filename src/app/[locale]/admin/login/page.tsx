'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/Button'
import Field from '@/components/Field'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from '@/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import '@/assets/admin.css'

interface FormData {
  email: string
  password: string
}

export default function SignIn() {
  const t = useTranslations()
  const router = useRouter()
  const { signInWithEmail } = useAuth()

  const schema = z.object({
    email: z.string().email(
      t('form.errors.invalid', {
        field: `${t('auth.sharedFields.email').toLowerCase()}`,
      }),
    ),
    password: z.string().min(
      6,
      t('form.errors.minLength', {
        field: `${t('auth.sharedFields.password').toLowerCase()}`,
        length: 6,
      }),
    ),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: FormData) {
    signInWithEmail(data.email, data.password, 'admin')
      .then(async () => {
        router.push('/admin/dashboard')
      })
      .catch((e: Error) => {
        toast.error(e.message)
      })
  }

  return (
    <section className="admin-login overflow-hidden">
      <article className="flex justify-center items-center h-screen">
        <div className="space-y-6 text-gray-600 max-w-md lg:min-w-96 max-sm:w-[80%]">
          <h3 className="text-white text-2xl font-bold sm:text-3xl">
            {t('auth.signIn.title')}
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Field.Label htmlFor="email" className="text-white">
                {t('auth.sharedFields.email')}
              </Field.Label>
              <Field.Input
                type="email"
                {...register('email')}
                className="text-white"
                style={{ backgroundColor: '#f5f5f54d' }}
                error={errors.email}
              />
              <Field.Error error={errors.email} />
            </div>
            <div>
              <Field.Label htmlFor="password" className="text-white">
                {t('auth.sharedFields.password')}
              </Field.Label>
              <Field.Input
                type="password"
                {...register('password')}
                className="text-white"
                style={{ backgroundColor: '#f5f5f54d' }}
                error={errors.password}
              />
              <Field.Error error={errors.password} />
            </div>
            <Button
              style={{ width: '100%', padding: '11px 16px 11px 16px' }}
              type="submit"
              loading={isSubmitting}
            >
              {t('auth.signIn.action')}
            </Button>
          </form>
        </div>
      </article>
    </section>
  )
}
