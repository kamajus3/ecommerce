'use client'

import { Dispatch, Fragment, SetStateAction, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Bounce, toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface FormData {
  name: string
  address: string
  phone: string
}

interface ConfirmOrderDialogProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  action: (data: FormData) => void | Promise<void>
}

const schema = z.object({
  name: z
    .string()
    .min(6, 'O nome deve ter no minimo 6 caracteres')
    .max(120, 'O nome deve ter no máximo 100 carácteres')
    .trim(),
  address: z
    .string({
      required_error: 'A morada é obrigatória',
    })
    .min(10, 'A morada deve ter no minimo 10 carácteres')
    .trim(),
  phone: z
    .string({
      required_error: 'O número de telefone é obrigatório',
    })
    .regex(/^(?:\+244)?\d{9}$/, 'O número do whatsapp está inválido'),
})

export default function ConfirmOrderDialog(props: ConfirmOrderDialogProps) {
  const cancelButtonRef = useRef(null)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    if (isDirty) {
      console.log(data)
      props.setOpen(false)
      router.replace(`https://wa.me/+244935420498?text=Apenas testando...`)
    } else {
      toast.warn('Nenhum campo foi alterado', {
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
    }
  }

  return (
    <Transition.Root show={props.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={props.setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start mx-auto px-5">
                    <article className="mt-2 m-auto w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-semibold leading-6 text-gray-900 mb-8 my-7"
                      >
                        Confirme o seu pedido
                      </Dialog.Title>
                      <div className="mb-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Seu nome
                        </label>
                        <input
                          type="text"
                          id="name"
                          autoComplete="given-name"
                          {...register('name')}
                          className={`w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.name && 'border-red-500'}`}
                        />
                        {errors.name && (
                          <p className="text-red-500 mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Número do whatsapp
                        </label>
                        <input
                          type="text"
                          id="phone"
                          {...register('phone')}
                          className={`w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.phone && 'border-red-500'}`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Morada
                        </label>
                        <input
                          type="text"
                          id="address"
                          autoComplete="street-address"
                          {...register('address')}
                          className={`w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.address && 'border-red-500'}`}
                        />
                        {errors.address && (
                          <p className="text-red-500 mt-1">
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                    </article>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-[#25D366] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-75 sm:ml-3 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <div
                        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      />
                    ) : (
                      <p className="text-white flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                          width="25"
                          height="25"
                        >
                          <rect width="256" height="256" fill="none" />
                          <path
                            d="M72,104a32,32,0,0,1,32-32l16,32-12.32,18.47a48.19,48.19,0,0,0,25.85,25.85L152,136l32,16a32,32,0,0,1-32,32A80,80,0,0,1,72,104Z"
                            fill="none"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="16"
                          />
                          <path
                            d="M79.93,211.11a96,96,0,1,0-35-35h0L32.42,213.46a8,8,0,0,0,10.12,10.12l37.39-12.47Z"
                            fill="none"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="16"
                          />
                        </svg>
                        Enviar pedido
                      </p>
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => props.setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancelar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </form>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
