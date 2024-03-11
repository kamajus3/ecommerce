'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Bounce, toast } from 'react-toastify'
import Header from '@/app/components/Header'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import Field from '@/app/components/Field'
import Button from '@/app/components/Button'

const schema = z.object({
  email: z.string().email('Preencha com um e-mail válido'),
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

            <Button
              style={{ width: '100%', padding: '11px 16px 11px 16px' }}
              type="submit"
              loading={isSubmitting}
            >
              Continuar
            </Button>
          </form>
        </div>
      </article>
    </section>
  )
}
