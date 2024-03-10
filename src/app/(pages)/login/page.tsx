'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Bounce, toast } from 'react-toastify'
import Header from '@/app/components/Header'
import Link from 'next/link'
import Field from '@/app/components/Field'

const schema = z.object({
  email: z.string().email('Preencha com um e-mail válido'),
  password: z
    .string()
    .min(6, 'A palavra-passe precisa de no minimo 6 caracteres'),
})

interface FormData {
  email: string
  password: string
}

export default function SignIn() {
  const router = useRouter()
  const { signInWithEmail } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: FormData) {
    signInWithEmail(data.email, data.password)
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
      <article className="flex justify-center items-center h-screen">
        <div className="space-y-6 text-gray-600 max-w-md lg:min-w-96 max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">
            Iniciar sessão
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Field.Label htmlFor="email">E-mail</Field.Label>
              <Field.Input
                type="email"
                {...register('email')}
                error={errors.email}
              />
              <Field.Error error={errors.email} />
            </div>
            <div>
              <Field.Label htmlFor="password">Palavra-passe</Field.Label>
              <Field.Input
                type="password"
                {...register('password')}
                error={errors.password}
              />
              <Field.Error error={errors.password} />
            </div>
            <div className="mt-5">
              <Link
                href="/recuperar-conta"
                className="hover:text-main font-medium"
              >
                Esqueceu a sua senha?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white font-medium bg-main hover:brightness-90 active:brightness-70 duration-150"
            >
              {isSubmitting ? (
                <div
                  className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              ) : (
                <p className="text-white">Entrar</p>
              )}
            </button>
          </form>
          <p className="text-center font-medium">
            Não tens uma conta?{' '}
            <Link href="/signup" className="text-main">
              Crie uma
            </Link>
          </p>
        </div>
      </article>
    </section>
  )
}
