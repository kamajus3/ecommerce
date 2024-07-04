'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Bounce, toast } from 'react-toastify'
import * as z from 'zod'

import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Header from '@/components/ui/Header'
import { useAuth } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z
  .object({
    name: z
      .string()
      .min(3, 'O nome deve ter no minimo 3 caracteres')
      .max(40, 'O nome deve ter no máximo 40 carácteres')
      .trim(),
    email: z.string().email('Preencha com um e-mail válido'),
    password: z
      .string()
      .min(6, 'A palavras-passe precisa de no minimo 6 caracteres')
      .max(40, 'A palavra-passe não pode exceder de 40 carácteres'),
    confirmPassword: z
      .string()
      .min(6, 'A palavras-passe precisa de no minimo 6 caracteres')
      .max(40, 'A palavra-passe não pode exceder de 40 carácteres'),
    consent: z.boolean().refine((val) => val === true, {
      message: 'Por favor aceite os termos e condições antes de continuar',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As palavras-passe não são semelhantes',
    path: ['confirmPassword'],
  })

interface IFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  consent: boolean
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({ resolver: zodResolver(schema) })

  const router = useRouter()
  const { signUpWithEmail } = useAuth()

  function onSubmit(data: IFormData) {
    signUpWithEmail(data.name, data.email, data.password)
      .then(() => {
        toast.success('A conta foi criada com sucesso', {
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
        router.push('/')
      })
      .catch((e: Error) => {
        toast.error(e.message, {
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

      <article className="flex justify-center items-center py-32">
        <div className="space-y-6 text-gray-600 max-w-md lg:min-w-96 max-sm:w-[80%]">
          <h3 className="text-black text-2xl font-bold sm:text-3xl">
            Criar conta
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Field.Label htmlFor="email">Nome</Field.Label>
              <Field.Input
                type="text"
                {...register('name')}
                error={errors.name}
              />
              <Field.Error error={errors.name} />
            </div>
            <div>
              <Field.Label htmlFor="email">E-mail</Field.Label>
              <Field.Input
                type="text"
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

            <div>
              <Field.Label htmlFor="confirmPassword">
                Confirmar palavra-passe
              </Field.Label>
              <Field.Input
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword}
              />
              <Field.Error error={errors.confirmPassword} />
            </div>

            <div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  {...register('consent')}
                  className="w-[90%] text-gray-500 bg-white outline-none"
                ></input>
                <label htmlFor="consent" className="font-medium">
                  Concordo com os{' '}
                  <Link href="/termos-gerais" className="text-main underline">
                    termos e condições
                  </Link>
                </label>
              </div>
              <Field.Error error={errors.consent} />
            </div>

            <Button
              style={{ width: '100%', padding: '11px 16px 11px 16px' }}
              type="submit"
              loading={isSubmitting}
            >
              Continuar
            </Button>
          </form>
          <p className="text-center font-medium">
            Você já tem uma conta?{' '}
            <Link href="/login" className="text-main">
              Iniciar sessão
            </Link>
          </p>
        </div>
      </article>
    </section>
  )
}
