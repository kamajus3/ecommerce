'use client'

import Image from 'next/image'
import googleIcon from '@/assets/images/google.svg'
import Header from '@/app/components/Header'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
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
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = (data: FormData) => {
    console.log(data)
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
                {...register('name')}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
              />
              {errors.name && (
                <p className="text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
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
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
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
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-main"
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
              Continuar
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
