'use client'

import { useTranslations } from 'next-intl'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/Button'
import Field from '@/components/Field'
import Header from '@/components/Header'
import { useRouter } from '@/navigation'
import { auth } from '@/services/firebase/config'
import { zodResolver } from '@hookform/resolvers/zod'

interface IFormData {
  email: string
}

export default function RecoverAccount() {
  const router = useRouter()
  const t = useTranslations()

  const schema = z.object({
    email: z.string().email(
      t('form.errors.invalid', {
        field: `${t('auth.sharedFields.email').toLowerCase()}`,
      }),
    ),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: IFormData) {
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        toast.success(t('auth.recoveryAccount.successful'), {
          onClose() {
            router.replace('/login')
          },
        })
      })
      .catch(() => {
        toast.error(t('auth.recoveryAccount.error'))
      })
  }

  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <article className="flex justify-center items-center h-screen">
        <div className="space-y-6 text-gray-600 max-w-md max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">
            {t('auth.recoveryAccount.title')}
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

            <Button
              style={{ width: '100%', padding: '11px 16px 11px 16px' }}
              type="submit"
              loading={isSubmitting}
            >
              {t('auth.recoveryAccount.action')}
            </Button>
          </form>
        </div>
      </article>
    </section>
  )
}
