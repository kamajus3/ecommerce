'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { updateProfile } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { UserRepository } from '@/repositories/user.repository'
import useUserStore from '@/store/UserStore'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  firstName: z
    .string()
    .min(2, 'O nome deve ter no minimo 2 caracteres')
    .max(40, 'O nome deve ter no máximo 40 carácteres')
    .trim(),
  lastName: z
    .string()
    .min(2, 'O sobrenome deve ter no minimo 2 caracteres')
    .max(40, 'O sobrenome deve ter no máximo 40 carácteres')
    .trim(),
  address: z
    .string({
      required_error: 'A morada é obrigatória',
    })
    .min(10, 'A morada deve ter no minimo 10 carácteres')
    .trim(),
})

interface IFormData {
  firstName: string
  lastName: string
  address: string
}

export default function PerfilUpdate() {
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

            toast.success('A tua conta foi atualizada com sucesso')
          })
          .catch(() => {
            toast.error('Houve algum erro ao tentar atualizar a seus dados')
          })
      } else {
        toast.warn('Você não atualizou nenhum campo')
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
            Salvar
          </Button>
        </div>
      </form>
    </article>
  )
}
