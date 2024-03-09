'use client'

import Header from '@/app/components/Header'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/useAuth'
import { Bounce, toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const schema = z
  .object({
    name: z
      .string()
      .min(6, 'O nome deve ter no minimo 6 caracteres')
      .max(40, 'O nome deve ter no máximo 40 carácteres')
      .trim(),
    email: z.string().email('E-mail inválido'),
    password: z
      .string()
      .min(6, 'A palavras-passe precisa de no minimo 6 caracteres')
      .max(40, 'A palavra-passe não pode exceder de 40 carácteres'),
    confirmPassword: z
      .string()
      .min(6, 'A palavras-passe precisa de no minimo 6 caracteres')
      .max(40, 'A palavra-passe não pode exceder de 40 carácteres'),
    consent: z.boolean().refine((val) => val === true, {
      message: 'Por favor aceite os termos e condições antes de continuar',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As palavras-passe não são semelhantes',
    path: ['confirmPassword'],
  })

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  consent: boolean
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const router = useRouter()
  const { signUpWithEmail } = useAuth()

  function onSubmit(data: FormData) {
    signUpWithEmail(data.name, data.email, data.password)
      .then(() => {
        toast.success('A conta foi criada com sucesso', {
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
        router.push('/')
      })
      .catch((e: Error) => {
        toast.error(e.message, {
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

  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />

      <article className="flex justify-center items-center py-32">
        <div className="space-y-6 text-gray-600 max-w-md max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">
            Criar conta
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="font-medium">Nome</label>
              <input
                type="text"
                {...register('name')}
                className="w-full rounded mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
              />
              {errors.name && (
                <p className="text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="font-medium">E-mail</label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
              />
              {errors.email && (
                <p className="text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
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

            <div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  {...register('consent')}
                  className="w-[90%] text-gray-500 bg-white outline-none"
                ></input>
                <label htmlFor="consent" className="font-medium">
                  Concordo com os{' '}
                  <Link href="/termos-gerais" className="text-main underline">
                    termos e condições
                  </Link>
                </label>
              </div>
              {errors.consent && (
                <p className="text-red-500 mt-1">{errors.consent.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded px-4 py-2 text-white font-medium bg-main hover:brightness-90 active:brightness-70 duration-150"
            >
              Continuar
            </button>
          </form>
          <p className="text-center font-medium">
            Você já tem uma conta?{' '}
            <Link href="/login" className="text-main">
              Iniciar sessão
            </Link>
          </p>
        </div>
      </article>
    </section>
  )
}
