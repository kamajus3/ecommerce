import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { EmailAuthProvider } from 'firebase/auth/cordova'
import { reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { useAuth } from '@/hooks/useAuth'
import { Bounce, toast } from 'react-toastify'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'

interface FormData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const schema = z
  .object({
    oldPassword: z
      .string()
      .min(6, 'A palavras-passe precisa de no minimo 6 caracteres'),
    newPassword: z
      .string()
      .min(6, 'A palavras-passe precisa de no minimo 6 caracteres')
      .max(40, 'A palavra-passe não pode exceder de 40 carácteres'),
    confirmPassword: z
      .string()
      .min(6, 'A palavras-passe precisa de no minimo 6 caracteres')
      .max(40, 'A palavra-passe não pode exceder de 40 carácteres'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As palavras-passe não são semelhantes',
    path: ['confirmPassword'],
  })

export function PasswordUpdate() {
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const { user } = useAuth()

  function onSubmit(data: FormData) {
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(
        user.email,
        data.oldPassword,
      )

      reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, data.newPassword)
            .then(() => {
              toast.success('Palavra-passe atualizada com sucesso', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
              })
            })
            .catch(() => {
              toast.error('Erro ao atualizar palavra-passe', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
              })
            })
        })
        .catch(() => {
          setError(
            'oldPassword',
            { type: 'focus', message: 'A palavra-passe está incorrecta.' },
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
          Alterar palavra-passe
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Field.Label htmlFor="oldPassword">
              Palavra-passe actual
            </Field.Label>
            <Field.Input
              type="password"
              {...register('oldPassword')}
              error={errors.oldPassword}
            />
            <Field.Error error={errors.oldPassword} />
          </div>
          <div className="sm:col-span-3">
            <Field.Label htmlFor="newPassword">Nova palavra-passe</Field.Label>
            <Field.Input
              type="password"
              {...register('newPassword')}
              error={errors.newPassword}
            />
            <Field.Error error={errors.newPassword} />
          </div>
          <div className="sm:col-span-4">
            <Field.Label htmlFor="confirmPassword">
              Confirmar palavra-passe
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
          Alterar a passe
        </Button>
      </div>
    </form>
  )
}
