'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { useAuth } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'

import '@/assets/admin.css'

const schema = z.object({
  email: z.string().email('Preencha um e-mail válido'),
  password: z
    .string()
    .min(6, 'A palavra-passe precisa de no minimo 6 caracteres'),
})

interface IFormData {
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
  } = useForm<IFormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: IFormData) {
    signInWithEmail(data.email, data.password, 'admin')
      .then(async () => {
        router.push('/admin/dashboard')
      })
      .catch((e: Error) => {
        toast.error(e.message)
      })
  }

  return (
    <section className="admin-login overflow-hidden">
      <article className="flex justify-center items-center h-screen">
        <div className="space-y-6 text-gray-600 max-w-md max-sm:w-[80%]">
          <h3 className="text-white text-center text-2xl font-bold sm:text-3xl">
            Bem vindo ao back-office
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Field.Label htmlFor="email" className="text-white">
                E-mail
              </Field.Label>
              <Field.Input
                type="email"
                {...register('email')}
                className="text-white"
                style={{ backgroundColor: '#f5f5f54d' }}
                error={errors.email}
              />
              <Field.Error error={errors.email} />
            </div>
            <div>
              <Field.Label htmlFor="password" className="text-white">
                Palavra-passe
              </Field.Label>
              <Field.Input
                type="password"
                {...register('password')}
                className="text-white"
                style={{ backgroundColor: '#f5f5f54d' }}
                error={errors.password}
              />
              <Field.Error error={errors.password} />
            </div>
            <Button
              style={{ width: '100%', padding: '11px 16px 11px 16px' }}
              type="submit"
              loading={isSubmitting}
            >
              Entrar
            </Button>
          </form>
        </div>
      </article>
    </section>
  )
}
