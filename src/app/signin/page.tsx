'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Image from 'next/image'
import googleIcon from '@/assets/images/google.svg'
import Header from '@/app/components/Header'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Bounce, toast } from 'react-toastify'

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email obrigatório'),
  password: yup
    .string()
    .required('Palavra-passe obrigatória')
    .min(8, 'Palavra-passe deve ter no mínimo 8 caracteres'),
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
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = (data: FormData) => {
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
      <Header />

      <article className="flex justify-center items-center h-screen">
        <div className="space-y-6 text-gray-600 max-w-md max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">Entrar</h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.email && 'border-red-500'}`}
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
                className={`w-full bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.password && 'border-red-500'}`}
              />
              {errors.password && (
                <p className="text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <a href="#" className="hover:text-main">
                Esqueceu sua palavra-passe?
              </a>
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
            <div>
              <button className="w-full flex items-center justify-center gap-3 py-2.5 border hover:bg-gray-50 duration-150 active:bg-gray-100">
                <Image src={googleIcon} alt="Icone do Google" />
                <p className="font-medium">Continuar com o Google</p>
              </button>
            </div>
          </form>
          <div className="text-center">
            <a href="/signup" className="hover:text-main">
              Você não tem uma conta? Criar uma
            </a>
          </div>
        </div>
      </article>
    </section>
  )
}
