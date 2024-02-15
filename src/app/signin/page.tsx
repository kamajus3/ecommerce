'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Image from 'next/image'
import googleIcon from '@/assets/images/google.svg'
import Header from '@/app/components/Header'

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = (data: FormData) => {
    console.log(data)
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
                className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.email && 'border-red-500'}`}
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
                className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.password && 'border-red-500'}`}
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
              Entrar
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
