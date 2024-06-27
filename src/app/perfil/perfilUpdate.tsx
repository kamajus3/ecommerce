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
import Modal from '@/components/Modal'
import Field from '@/components/Field'
import Button from '@/components/Button'

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
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const [openPasswordModal, setPasswordModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')

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
              setNewEmail(data.email)
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

  async function sendEmailUpdateLink(newUserEmail: string) {
    if (user) {
      await verifyBeforeUpdateEmail(user, newUserEmail)
        .then(() => {
          toast.success(
            `Foi enviado um código de verificação no seu novo email (${newUserEmail})`,
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

  function sendVerificationEmail() {
    if (user) {
      sendEmailVerification(user)
        .then(() => {
          toast.success('Foi enviado um código de verificação no seu email', {
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
    }
  }

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
                <Field.Label htmlFor="firstName">Primeiro nome</Field.Label>
                <Field.Input
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName')}
                  error={errors.firstName}
                />
                <Field.Error error={errors.firstName} />
              </div>
              <div className="sm:col-span-3">
                <Field.Label htmlFor="lastName">Sobrenome</Field.Label>
                <Field.Input
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName')}
                  error={errors.lastName}
                />
                <Field.Error error={errors.lastName} />
              </div>
              <div className="sm:col-span-4 gap-x-1">
                <Field.Label htmlFor="email">
                  <span>E-mail</span>

                  {user && !user?.emailVerified && (
                    <button
                      className="bg-main ml-2 px-3 py-1 text-sm text-white shadow-sm hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      type="button"
                      onClick={sendVerificationEmail}
                    >
                      Verificar o seu email
                    </button>
                  )}
                </Field.Label>
                <Field.Input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  error={errors.email}
                />
                <Field.Error error={errors.email} />
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <Field.Label htmlFor="phone">Número de telefone</Field.Label>
                <Field.Input
                  type="tel"
                  {...register('phone')}
                  error={errors.phone}
                />
                <Field.Error error={errors.phone} />
              </div>
              <div className="col-span-full">
                <Field.Label htmlFor="phone">Morada</Field.Label>
                <Field.Input
                  type="text"
                  autoComplete="street-address"
                  {...register('address')}
                  error={errors.address}
                />
                <Field.Error error={errors.address} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button type="submit" loading={isSubmitting}>
            Atualizar perfil
          </Button>
        </div>
      </form>
      <Modal.Password
        actionWithParam={sendEmailUpdateLink}
        actionParam={newEmail}
        isOpen={openPasswordModal}
        setOpen={setPasswordModal}
      />
    </article>
  )
}
