'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ref, set } from 'firebase/database'
import {
  sendEmailVerification,
  updateProfile,
  verifyBeforeUpdateEmail,
} from 'firebase/auth'
import { database } from '@/lib/firebase/config'
import { Bounce, toast } from 'react-toastify'
import Modal from '@/app/components/Modal'

const schema = z.object({
  firstName: z
    .string()
    .min(6, 'O nome deve ter no minimo 6 caracteres')
    .max(40, 'O nome deve ter no máximo 40 carácteres')
    .trim(),
  lastName: z
    .string()
    .min(6, 'O sobrenome deve ter no minimo 6 caracteres')
    .max(40, 'O sobrenome deve ter no máximo 40 carácteres')
    .trim(),
  address: z
    .string({
      required_error: 'A morada é obrigatória',
    })
    .min(10, 'A morada deve ter no minimo 10 carácteres')
    .trim(),
  phone: z
    .string({
      required_error: 'O número de telefone é obrigatório',
    })
    .regex(/^(?:\+244)?\d{9}$/, 'O número de telefone está inválido'),
  email: z.string().email('Email inválido'),
})

interface FormData {
  firstName: string
  lastName: string
  email: string
  address: string
  phone: string
}

export default function PerfilUpdate() {
  const { userDB, user } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const newUserEmail = watch('email')
  const [openPasswordModal, setPasswordModal] = useState(false)

  const onSubmit = (data: FormData) => {
    if (user && userDB) {
      if (
        dirtyFields.firstName ||
        dirtyFields.lastName ||
        dirtyFields.email ||
        dirtyFields.phone ||
        dirtyFields.address
      ) {
        set(ref(database, 'users/' + user.uid), {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
          privileges: userDB.privileges,
        })
          .then(async () => {
            await updateProfile(user, {
              displayName: `${data.firstName} ${data.lastName}`,
            })

            if (user.email !== data.email) {
              setPasswordModal(true)
            }

            updateFieldAsDefault(data)

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
            toast.error('Houve algum erro ao tentar atualizar a seus dados', {
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
  }

  async function sendEmailUpdateLink() {
    if (user) {
      await verifyBeforeUpdateEmail(user, newUserEmail)
        .then(() => {
          toast.success(
            'Foi enviado um código de verificação no seu novo email',
            {
              position: 'top-right',
              autoClose: 7000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            },
          )
        })
        .catch(() => {
          toast.error(
            'Houve algum erro ao tentar enviar um código de verificação no seu email',
            {
              position: 'top-right',
              autoClose: 7000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            },
          )
        })
    }
  }

  const updateFieldAsDefault = useCallback(
    (data?: FormData) => {
      if (userDB && user) {
        const userData = data || userDB
        setValue('firstName', userData.firstName, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        })
        setValue('lastName', userData.lastName || '', {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        })
        setValue('email', user.email || '', {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        })
        setValue('phone', userData.phone || '', {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        })
        setValue('address', userData.address || '', {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        })
      }
    },
    [setValue, userDB, user],
  )

  useEffect(() => {
    updateFieldAsDefault()
  }, [updateFieldAsDefault])

  return (
    <article>
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
                  className=" text-sm font-medium leading-6 text-gray-900 flex items-center gap-x-3"
                >
                  <span>Email</span>

                  {user && !user?.emailVerified && (
                    <button
                      className="bg-main px-3 py-1 text-sm text-white shadow-sm hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      type="button"
                      onClick={() => {
                        sendEmailVerification(user)
                          .then(() => {
                            toast.success(
                              'Foi enviado um código de verificação no seu email',
                              {
                                position: 'top-right',
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                                theme: 'light',
                                transition: Bounce,
                              },
                            )
                          })
                          .catch(() => {
                            toast.error(
                              'Erro ao enviar código de verificação, tente novamente mais tarde',
                              {
                                position: 'top-right',
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                                theme: 'light',
                                transition: Bounce,
                              },
                            )
                          })
                      }}
                    >
                      Verificar o seu email
                    </button>
                  )}
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
              <p className="text-white">Atualizar perfil</p>
            )}
          </button>
        </div>
      </form>
      <Modal.Password
        action={sendEmailUpdateLink}
        isOpen={openPasswordModal}
        setOpen={setPasswordModal}
      />
    </article>
  )
}
