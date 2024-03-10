'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Bounce, toast } from 'react-toastify'
import Header from '@/app/components/Header'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import Field from '@/app/components/Field'

const schema = z.object({
  email: z.string().email('Preencha um e-mail válido'),
})

interface FormData {
  email: string
}

export default function RecoverAccount() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: FormData) {
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        reset({
          email: '',
        })

        toast.success(
          'Uma mensagem mensagem nesse email foi enviada para recuperar a sua conta',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          },
        )
      })
      .catch(() => {
        toast.error('Houve algum erro ao resetar a tua conta', {
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
      <article className="flex justify-center items-center h-screen">
        <div className="space-y-6 text-gray-600 max-w-md max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">
            Recupere a sua conta
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
                <p className="text-white">Continuar</p>
              )}
            </button>
          </form>
        </div>
      </article>
    </section>
  )
}
