'use client'

// import { UserCircleIcon } from 'lucide-react'
import Footer from '../components/Footer'
import HeaderBase from '../components/Header/HeaderBase'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ref, set } from 'firebase/database'
import { reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { database } from '@/config/firebase'
import { Bounce, toast } from 'react-toastify'
import { EmailAuthProvider } from 'firebase/auth/cordova'

const schema = yup.object().shape({
  firstName: yup.string().required('O nome é obrigatório').trim(),
  lastName: yup.string().required('O sobrenome é obrigatório').trim(),
  address: yup.string().required('A morada é obrigatória').trim(),
  phone: yup.string().required('O número de telefone é obrigatório'),
  email: yup.string().email('Email inválido').required('Email obrigatório'),
  oldPassword: yup.string().matches(/^.{8,}$/, {
    excludeEmptyString: true,
    message: 'Palavra-passe deve ter no mínimo 8 caracteres',
  }),
  newPassword: yup
    .string()
    .matches(/^.{8,}$/, {
      excludeEmptyString: true,
      message: 'Palavra-passe deve ter no mínimo 8 caracteres',
    })
    .matches(/^.{1,32}$/, {
      excludeEmptyString: true,
      message: 'A palavra-passe não pode ter mais de 32 caracteres',
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'As palavras-passe devem ser iguais')
    .trim(),
})

interface FormData {
  firstName: string
  lastName: string
  email: string
  address: string
  phone: string
  oldPassword?: string | null
  newPassword?: string | null
  confirmPassword?: string
}

export default function PerfilPage() {
  const { userDatabase, user } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    if (isDirty) {
      set(ref(database, 'users/' + user?.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      })
        .then(() => {
          toast.success('A tua conta foi atualizada com sucesso', {
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
          toast.error('Houve algum erro.', {
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

      if (data.newPassword && user && user.email && data.oldPassword) {
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
    } else {
      toast.warn('Você não atualizou nenhum campo', {
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
    }
  }

  useEffect(() => {
    if (userDatabase) {
      setValue('firstName', userDatabase.firstName, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      })
      setValue('lastName', userDatabase.lastName || '', {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      })
      setValue('email', userDatabase.email, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      })
      setValue('phone', userDatabase.phone || '', {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      })
      setValue('address', userDatabase.address || '', {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      })
    }
  }, [userDatabase, setValue])

  return (
    <section className="bg-white overflow-hidden">
      <HeaderBase />
      <form className="p-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Meu perfil
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Essas informações vão ser usados para podermos falar contigo, nada
              será partilhado com terceiros.
            </p>

            {/* <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Fotografia
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UserCircleIcon
                    className="h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    className="bg-white px-2.5 px-3 py-2 bg-neutral-100 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Alterar
                  </button>
                </div>
              </div>
            </div> */}
          </div>
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Informação pessoal
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use um email activo para poderes receber mensagens.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Primeiro nome
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    autoComplete="given-name"
                    {...register('firstName')}
                    className="block w-full border-0 px-3 py-2 bg-neutral-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Sobrenome
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    autoComplete="family-name"
                    {...register('lastName')}
                    className="block w-full border-0 px-3 py-2 bg-neutral-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className="block w-full border-0 px-3 py-2 bg-neutral-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.email && (
                    <p className="text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Número de telefone
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="block w-full border-0 px-3 py-2 bg-neutral-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.phone && (
                    <p className="text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="street-address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Morada
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="street-address"
                    autoComplete="street-address"
                    {...register('address')}
                    className="block w-full border-0 px-3 py-2 bg-neutral-100 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.address && (
                    <p className="text-red-500 mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
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
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isSubmitting ? (
              <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              />
            ) : (
              <p className="text-white">Guardar</p>
            )}
          </button>
        </div>
      </form>
      <Footer />
    </section>
  )
}
