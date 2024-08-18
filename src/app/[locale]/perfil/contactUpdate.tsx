'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { sendEmailVerification, verifyBeforeUpdateEmail } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Modal from '@/components/ui/Modal'
import { UserRepository } from '@/repositories/user.repository'
import useUserStore from '@/store/UserStore'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  phone: z
    .string({
      required_error: 'O número de telefone é obrigatório',
    })
    .regex(/^(?:\+244)?\d{9}$/, 'O número de telefone está inválido'),
  email: z.string().email('Email inválido'),
})

interface IFormData {
  email: string
  phone: string
}

export default function ContactUpdate() {
  const user = useUserStore((state) => state.metadata)
  const userDB = useUserStore((state) => state.data)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  })

  const [openPasswordModal, setPasswordModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')

  const userReposiyory = useMemo(() => new UserRepository(), [])

  const onSubmit = (data: IFormData) => {
    if (user && userDB) {
      if (dirtyFields.email || dirtyFields.phone) {
        userReposiyory
          .update(
            {
              phone: data.phone,
            },
            user.uid,
          )
          .then(async () => {
            if (user.email !== data.email) {
              setNewEmail(data.email)
              setPasswordModal(true)
            }

            updateFieldAsDefault(data)

            toast.success('Os seus dados foram atualizados')
          })
          .catch(() => {
            toast.error('Erro ao atualizar os seus dados')
          })
      } else {
        toast.warn('Você não atualizou nenhum campo')
      }
    }
  }

  async function sendEmailUpdateLink(newUserEmail: string) {
    if (user) {
      await verifyBeforeUpdateEmail(user, newUserEmail)
        .then(() => {
          toast.success(
            `Foi enviado um código de verificação no email ${newUserEmail}`,
          )
        })
        .catch(() => {
          toast.error(
            'Houve algum erro ao tentar enviar um código de verificação no seu email',
          )
        })
    }
  }

  const updateFieldAsDefault = useCallback(
    (data?: IFormData) => {
      if (userDB && user) {
        const userData = data || userDB
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
          toast.success('Foi enviado um código de verificação no seu email')
        })
        .catch(() => {
          toast.error(
            'Erro ao enviar código de verificação, tente novamente mais tarde',
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
              Contactos
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use um email activo para poderes receber mensagens.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4 gap-x-1">
                <Field.Label htmlFor="email">
                  <span>E-mail</span>

                  {user && !user?.emailVerified && (
                    <button
                      className="bg-primary ml-2 px-3 py-1 text-sm text-white shadow-sm hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button type="submit" loading={isSubmitting}>
            Salvar
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
