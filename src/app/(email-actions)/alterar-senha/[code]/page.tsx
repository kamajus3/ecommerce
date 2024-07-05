'use client'

import { useEffect, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { AuthError, checkActionCode, confirmPasswordReset } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { Bounce, toast } from 'react-toastify'
import * as z from 'zod'

import Header from '@/components/ui/Header'
import Loading from '@/components/ui/Loading'
import { auth } from '@/services/firebase/config'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z
  .object({
    password: z
      .string()
      .min(6, 'A palavras-passe precisa de no minimo 6 caracteres')
      .max(40, 'A palavra-passe não pode exceder de 40 carácteres'),
    confirmPassword: z
      .string()
      .min(6, 'A palavras-passe precisa de no minimo 6 caracteres')
      .max(40, 'A palavra-passe não pode exceder de 40 carácteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As palavras-passe não são semelhantes',
    path: ['confirmPassword'],
  })

interface IFormData {
  password: string
  confirmPassword: string
}

export default function ChangePassword({
  params: { code },
}: {
  params: { code: string }
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({ resolver: zodResolver(schema) })

  const [loading, setLoading] = useState(true)
  const router = useRouter()

  function onSubmit(data: IFormData) {
    confirmPasswordReset(auth, code, data.password)
      .then(() => {
        toast.success('A sua palavra-passe foi alterada com sucesso', {
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

        setTimeout(() => {
          router.replace('/')
        }, 2000)
      })
      .catch((e: AuthError) => {
        let errorMessage = ''
        if (e.code === 'auth/expired-action-code') {
          errorMessage = 'O seu código para alterar a palavra-passe expirou'
        } else if (e.code === 'auth/invalid-action-code') {
          errorMessage = 'O código para validar a sua conta é invalido'
        } else if (e.code === 'auth/user-disabled') {
          errorMessage = 'Essa conta não está hablitada'
        } else if (e.code === 'auth/user-disabled') {
          errorMessage = 'Essa conta não foi encontrada'
        } else if (e.code === 'auth/user-disabled') {
          errorMessage =
            'A nova palavra-passe fornecida não é forte o suficiente'
        } else {
          errorMessage = 'Houve algum erro ao tentar alterar a sua senha'
        }

        toast.error(errorMessage, {
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
  }

  useEffect(() => {
    checkActionCode(auth, code)
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        notFound()
      })
  }, [code])

  return loading ? (
    <Loading />
  ) : (
    <section className="bg-white min-h-screen">
      <Header.Client />

      <article className="flex justify-center items-center py-32">
        <div className="space-y-6 text-gray-600 max-w-md max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">
            Alterar a sua palavra-passe
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="font-medium">Palavra-passe</label>
              <input
                type="password"
                {...register('password')}
                className="w-full rounded mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
              />
              {errors.password && (
                <p className="text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="font-medium">Confirmar palavra-passe</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full rounded mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded px-4 py-2 text-white font-medium bg-main hover:brightness-90 active:brightness-70 duration-150"
            >
              Continuar
            </button>
          </form>
        </div>
      </article>
    </section>
  )
}
