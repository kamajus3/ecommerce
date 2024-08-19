'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { sendEmailVerification, verifyBeforeUpdateEmail } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

 import Modal from '@/components/Modal'
import Button from '@/components/Button'
import Field from '@/components/Field'
import { UserRepository } from '@/repositories/user.repository'
import useUserStore from '@/store/UserStore'
import { zodResolver } from '@hookform/resolvers/zod'

interface IFormData {
  email: string
  phone: string
}

export default function ContactUpdate() {
  const t = useTranslations()
  const user = useUserStore((state) => state.metadata)
  const userDB = useUserStore((state) => state.data)

  const schema = z.object({
    phone: z
      .string({
        required_error: t('form.errors.required', {
          field: `${t('settings.perfilUpdate.fields.phone').toLowerCase()}`,
        }),
      })
      .regex(
        /^(?:\+244)?\d{9}$/,
        t('form.errors.invalid', {
          field: `${t('settings.perfilUpdate.fields.phone').toLowerCase()}`,
        }),
      ),
    email: z.string().email('Email inválido'),
  })

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

            toast.success(t('settings.contactUpdate.successful'))
          })
          .catch(() => {
            toast.error(t('settings.contactUpdate.error'))
          })
      } else {
        toast.warn(t('form.noFieldChanged'))
      }
    }
  }

  async function updateEmail(newUserEmail: string) {
    if (user) {
      await verifyBeforeUpdateEmail(user, newUserEmail)
        .then(() => {
          toast.success(t('settings.contactUpdate.updateEmail.successful'))
        })
        .catch(() => {
          toast.success(t('settings.contactUpdate.updateEmail.error'))
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

  function verificateEmail() {
    if (user) {
      sendEmailVerification(user)
        .then(() => {
          toast.success(t('settings.contactUpdate.verificateEmail.successful'))
        })
        .catch(() => {
          toast.success(t('settings.contactUpdate.verificateEmail.error'))
        })
    }
  }

  return (
    <article>
      <form className="p-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {t('settings.contactUpdate.title')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {t('settings.contactUpdate.warn')}
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4 gap-x-1">
                <Field.Label htmlFor="email">
                  <span>{t('settings.contactUpdate.fields.email')}</span>

                  {user && !user?.emailVerified && (
                    <button
                      className="bg-primary ml-2 px-3 py-1 text-sm text-white shadow-sm hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      type="button"
                      onClick={verificateEmail}
                    >
                      {t('settings.contactUpdate.buttonVerificateEmail')}
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
                <Field.Label htmlFor="phone">
                  {t('settings.contactUpdate.fields.phone')}
                </Field.Label>
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
            {t('settings.buttonSave')}
          </Button>
        </div>
      </form>
      <Modal.Password
        actionWithParam={updateEmail}
        actionParam={newEmail}
        isOpen={openPasswordModal}
        setOpen={setPasswordModal}
      />
    </article>
  )
}
