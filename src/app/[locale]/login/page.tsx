'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Header from '@/components/ui/Header'
import { useAuth } from '@/hooks/useAuth'
import { Link, useRouter } from '@/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

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
    signInWithEmail(data.email, data.password, 'client')
      .then(async () => {
        router.push('/')
      })
      .catch((e: Error) => {
        toast.error(e.message)
      })
  }

  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <article className="flex justify-center items-center h-screen">
        <div className="space-y-6 text-gray-600 max-w-md lg:min-w-96 max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">
            {t('auth.signIn.title')}
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Field.Label htmlFor="email">
                {t('auth.sharedFields.email')}
              </Field.Label>
              <Field.Input
                type="email"
                {...register('email')}
                error={errors.email}
              />
              <Field.Error error={errors.email} />
            </div>
            <div>
              <Field.Label htmlFor="password">
                {t('auth.sharedFields.password')}
              </Field.Label>
              <Field.Input
                type="password"
                {...register('password')}
                error={errors.password}
              />
              <Field.Error error={errors.password} />
            </div>
            <div className="mt-5">
              <Link href="/recovery" className="hover:text-primary font-medium">
                {t('auth.signIn.forgotPassword')}
              </Link>
            </div>
            <Button
              style={{ width: '100%', padding: '11px 16px 11px 16px' }}
              type="submit"
              loading={isSubmitting}
            >
              {t('auth.signIn.action')}
            </Button>
          </form>
          <p className="text-center font-medium">
            {t('auth.signIn.dontHaveAccount')}{' '}
            <Link href="/signup" className="text-primary">
              {t('auth.signIn.createOne')}
            </Link>
          </p>
        </div>
      </article>
    </section>
  )
}
