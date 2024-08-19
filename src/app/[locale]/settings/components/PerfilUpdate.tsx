'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { updateProfile } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/Button'
import Field from '@/components/Field'
import { UserRepository } from '@/repositories/user.repository'
import useUserStore from '@/store/UserStore'
import { zodResolver } from '@hookform/resolvers/zod'

interface IFormData {
  firstName: string
  lastName: string
  address: string
}

export default function PerfilUpdate() {
  const t = useTranslations()

  const user = useUserStore((state) => state.metadata)
  const userDB = useUserStore((state) => state.data)

  const schema = z.object({
    firstName: z
      .string()
      .min(
        2,
        t('form.errors.minLength', {
          field: `${t('settings.perfilUpdate.fields.firstName').toLowerCase()}`,
          length: 2,
        }),
      )
      .max(
        40,
        t('form.errors.maxLength', {
          field: `${t('settings.perfilUpdate.fields.firstName').toLowerCase()}`,
          length: 40,
        }),
      )
      .trim(),
    lastName: z
      .string()
      .min(
        2,
        t('form.errors.minLength', {
          field: `${t('settings.perfilUpdate.fields.lastName').toLowerCase()}`,
          length: 2,
        }),
      )
      .max(
        40,
        t('form.errors.maxLength', {
          field: `${t('settings.perfilUpdate.fields.lastName').toLowerCase()}`,
          length: 40,
        }),
      )
      .trim(),
    address: z
      .string({
        required_error: t('form.errors.required', {
          field: `${t('settings.perfilUpdate.fields.address').toLowerCase()}`,
        }),
      })
      .min(
        10,
        t('form.errors.minLength', {
          field: `${t('settings.perfilUpdate.fields.address').toLowerCase()}`,
          length: 10,
        }),
      )
      .trim(),
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  })

  const userRepository = useMemo(() => new UserRepository(), [])

  const onSubmit = (data: IFormData) => {
    if (user && userDB) {
      if (
        dirtyFields.firstName ||
        dirtyFields.lastName ||
        dirtyFields.address
      ) {
        userRepository
          .update(
            {
              firstName: data.firstName,
              lastName: data.lastName,
              address: data.address,
            },
            user.uid,
          )
          .then(async () => {
            await updateProfile(user, {
              displayName: `${data.firstName} ${data.lastName}`,
            })
            updateFieldAsDefault(data)

            toast.success(t('settings.perfilUpdate.successful'))
          })
          .catch(() => {
            toast.error(t('settings.perfilUpdate.error'))
          })
      } else {
        toast.warn(t('form.noFieldChanged'))
      }
    }
  }

  const updateFieldAsDefault = useCallback(
    (data?: IFormData) => {
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
              {t('settings.title')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {t('settings.description')}
            </p>
          </div>
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {t('settings.perfilUpdate.title')}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Field.Label htmlFor="firstName">
                  {t('settings.perfilUpdate.fields.firstName')}
                </Field.Label>
                <Field.Input
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName')}
                  error={errors.firstName}
                />
                <Field.Error error={errors.firstName} />
              </div>
              <div className="sm:col-span-3">
                <Field.Label htmlFor="lastName">
                  {t('settings.perfilUpdate.fields.lastName')}
                </Field.Label>
                <Field.Input
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName')}
                  error={errors.lastName}
                />
                <Field.Error error={errors.lastName} />
              </div>
              <div className="col-span-full">
                <Field.Label htmlFor="address">
                  {t('settings.perfilUpdate.fields.address')}
                </Field.Label>
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
            {t('settings.buttonSave')}
          </Button>
        </div>
      </form>
    </article>
  )
}
