import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { EmailAuthProvider } from 'firebase/auth/cordova'
import { reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { useAuth } from '@/hooks/useAuth'
import { Bounce, toast } from 'react-toastify'

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
            <label
              htmlFor="first-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Palavra-passe actual
            </label>
            <div className="mt-2">
              <input
                type="password"
                id="oldPassword"
                {...register('oldPassword')}
                className="block w-full border-0 px-3 py-2 bg-neutral-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.oldPassword && (
                <p className="text-red-500 mt-1">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nova palavra-passe
            </label>
            <div className="mt-2">
              <input
                type="password"
                id="newPassword"
                {...register('newPassword')}
                className="block w-full border-0 px-3 py-2 bg-neutral-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.newPassword && (
                <p className="text-red-500 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          </div>
          <div className="sm:col-span-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirmar palavra-passe
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="block w-full border-0 px-3 py-2 bg-neutral-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="bg-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {isSubmitting ? (
            <div
              className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            />
          ) : (
            <p className="text-white">Alterar a passe</p>
          )}
        </button>
      </div>
    </form>
  )
}
