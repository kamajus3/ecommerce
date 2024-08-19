'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/Button'
import Field from '@/components/Field'
import Header from '@/components/Header'
import { useAuth } from '@/hooks/useAuth'
import { Link, useRouter } from '@/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

interface IFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  consent: boolean
}

export default function SignUp() {
  const t = useTranslations()

  const schema = z
    .object({
      name: z
        .string()
        .min(
          2,
          t('form.errors.minLength', {
            field: `${t('auth.signUp.fields.name').toLowerCase()}`,
            length: 2,
          }),
        )
        .max(
          40,
          t('form.errors.maxLength', {
            field: `${t('auth.signUp.fields.name').toLowerCase()}`,
            length: 40,
          }),
        )
        .trim(),
      email: z.string().email(
        t('form.errors.invalid', {
          field: `${t('auth.sharedFields.email').toLowerCase()}`,
        }),
      ),
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
      consent: z.boolean().refine((val) => val === true, {
        message: t('form.errors.acceptTerms'),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('form.errors.passwordsNotSimilar'),
      path: ['confirmPassword'],
    })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({ resolver: zodResolver(schema) })

  const router = useRouter()
  const { signUpWithEmail } = useAuth()

  function onSubmit(data: IFormData) {
    signUpWithEmail(data.name, data.email, data.password)
      .then(() => {
        toast.success(t('auth.signUp.successful'))
        router.push('/')
      })
      .catch((e: Error) => {
        toast.error(e.message)
      })
  }

  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />

      <article className="flex justify-center items-center py-32">
        <div className="space-y-6 text-gray-600 max-w-md lg:min-w-96 max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">
            {t('auth.signUp.title')}
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Field.Label htmlFor="email">
                {t('auth.signUp.fields.name')}
              </Field.Label>
              <Field.Input
                type="text"
                {...register('name')}
                error={errors.name}
              />
              <Field.Error error={errors.name} />
            </div>
            <div>
              <Field.Label htmlFor="email">
                {t('auth.sharedFields.email')}
              </Field.Label>
              <Field.Input
                type="text"
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

            <div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  {...register('consent')}
                  className="w-[90%] text-gray-500 bg-white outline-none"
                ></input>
                <label htmlFor="consent" className="font-medium">
                  {t('auth.signUp.termsPartOne')}{' '}
                  <Link href="/terms" className="text-primary underline">
                    {t('auth.signUp.termsPartTwo')}
                  </Link>
                </label>
              </div>
              <Field.Error error={errors.consent} />
            </div>

            <Button
              style={{ width: '100%', padding: '11px 16px 11px 16px' }}
              type="submit"
              loading={isSubmitting}
            >
              {t('auth.signUp.action')}
            </Button>
          </form>
          <p className="text-center font-medium">
            {t('auth.signUp.haveAccount')}{' '}
            <Link href="/login" className="text-primary">
              {t('auth.signUp.signIn')}
            </Link>
          </p>
        </div>
      </article>
    </section>
  )
}
