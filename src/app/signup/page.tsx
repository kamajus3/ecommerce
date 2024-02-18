'use client'

import Image from 'next/image'
import googleIcon from '@/assets/images/google.svg'
import Header from '@/app/components/Header'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Bounce, toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const schema = yup.object().shape({
  firstName: yup.string().required('O nome obrigatório'),
  email: yup.string().email('Email inválido').required('Email obrigatório'),
  password: yup
    .string()
    .required('Palavra-passe obrigatória')
    .min(8, 'Palavra-passe deve ter no mínimo 8 caracteres'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'As palavras-passe devem ser iguais')
    .required('Confirmação de palavra-passe obrigatória'),
})

interface FormData {
  firstName: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const { signUpWithEmail } = useAuth()

  const onSubmit = (data: FormData) => {
    setLoading(true)
    signUpWithEmail(data.firstName, data.email, data.password)
      .then(() => {
        toast.success('Conta criada com sucesso!', {
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

        router.replace('/')
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
    setLoading(false)
  }

  return (
    <section className="bg-white overflow-hidden">
      <Header />

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
                {...register('firstName')}
                className="w-full bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
              />
              {errors.firstName && (
                <p className="text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
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
                className="w-full bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
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
                className="w-full bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white font-medium bg-main hover:brightness-90 active:brightness-70 duration-150"
            >
              {isLoading ? (
                <div
                  className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              ) : (
                <p className="text-white">Continuar</p>
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
            <a href="/signin" className="hover:text-main">
              Você já tem uma conta? Iniciar sessão
            </a>
          </div>
        </div>
      </article>
    </section>
  )
}
