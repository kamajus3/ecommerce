'use client'

import Image from 'next/image'
import googleIcon from '@/assets/images/google.svg'
import Header from '@/app/components/Header'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/useAuth'
import { Bounce, toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

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
    signUpWithEmail(data.email, data.password)
      .then(() => {
        router.push('/')
      })
      .catch((e: Error) => {
        toast.error(e.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
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

            <button
              type="submit"
              className="w-full rounded px-4 py-2 text-white font-medium bg-main hover:brightness-90 active:brightness-70 duration-150"
            >
              Continuar
            </button>
            <div>
              <button className="w-full rounded flex items-center justify-center gap-3 py-2.5 border hover:bg-gray-50 duration-150 active:bg-gray-100">
                <Image src={googleIcon} alt="Icone do Google" />
                <p className="font-medium">Continuar com o Google</p>
              </button>
            </div>
          </form>
          <div className="text-center">
            <a href="/login" className="hover:text-main">
              Você já tem uma conta? Iniciar sessão
            </a>
          </div>
        </div>
      </article>
    </section>
  )
}
