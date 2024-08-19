import { useTranslations } from 'next-intl'
import { reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { EmailAuthProvider } from 'firebase/auth/cordova'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/Button'
import Field from '@/components/Field'
import useUserStore from '@/store/UserStore'
import { zodResolver } from '@hookform/resolvers/zod'

interface IFormData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export default function PasswordUpdate() {
  const t = useTranslations()

  const schema = z
    .object({
      oldPassword: z
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
      newPassword: z
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
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('form.errors.passwordsNotSimilar'),
      path: ['confirmPassword'],
    })

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  })

  const user = useUserStore((state) => state.metadata)

  function onSubmit(data: IFormData) {
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(
        user.email,
        data.oldPassword,
      )

      reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, data.newPassword)
            .then(() => {
              toast.success(t('settings.updatePassword.successful'))
            })
            .catch(() => {
              toast.error(t('settings.updatePassword.error'))
            })
        })
        .catch(() => {
          setError(
            'oldPassword',
            { type: 'focus', message: t('form.errors.incorrectPassword') },
            { shouldFocus: true },
          )
        })
    }

    reset({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  return (
    <form className="p-10" onSubmit={handleSubmit(onSubmit)}>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          {t('settings.updatePassword.title')}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Field.Label htmlFor="oldPassword">
              {t('settings.updatePassword.fields.actualPassword')}
            </Field.Label>
            <Field.Input
              type="password"
              {...register('oldPassword')}
              error={errors.oldPassword}
            />
            <Field.Error error={errors.oldPassword} />
          </div>
          <div className="sm:col-span-3">
            <Field.Label htmlFor="newPassword">
              {t('settings.updatePassword.fields.newPassword')}
            </Field.Label>
            <Field.Input
              type="password"
              {...register('newPassword')}
              error={errors.newPassword}
            />
            <Field.Error error={errors.newPassword} />
          </div>
          <div className="sm:col-span-4">
            <Field.Label htmlFor="confirmPassword">
              {t('settings.updatePassword.fields.confirmPassword')}
            </Field.Label>
            <Field.Input
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword}
            />
            <Field.Error error={errors.confirmPassword} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="submit" loading={isSubmitting}>
          {t('settings.buttonSave')}
        </Button>
      </div>
    </form>
  )
}
