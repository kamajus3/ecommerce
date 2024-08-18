'use client'

import { sendPasswordResetEmail } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Header from '@/components/ui/Header'
import { auth } from '@/services/firebase/config'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email('Preencha com um e-mail válido'),
})

interface IFormData {
  email: string
}

export default function RecoverAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: IFormData) {
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        toast.success(
          'Uma mensagem mensagem nesse email foi enviada para recuperar a sua conta',
        )
      })
      .catch(() => {
        toast.error('Houve algum erro ao resetar a tua conta')
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
