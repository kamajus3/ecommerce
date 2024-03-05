'use client'

import { Dispatch, Fragment, SetStateAction, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ProductItem } from '@/@types'

interface FormData {
  name: string
  address: string
  phone: string
}

interface CartProduct extends ProductItem {
  quantity: number
}

interface ConfirmOrderDialogProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  action: (data: FormData) => void | Promise<void>
  selectedProducts: string[]
  productData: CartProduct[]
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormData) {
    console.log(data)
  }

  // function createDelivery(name: string, phone: string, address: string) {
  //   const delivery = props.productData.map((p) => {
  //     if (props.selectedProducts.includes(p.id)) {
  //       return `${p.name}: x${p.quantity}`
  //     }
  //     return null
  //   })

  //   const deliveryMessage = delivery.filter((p) => p !== null).join(', ')
  // }

  return (
    <Transition.Root show={props.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
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
                        Enviar o seu pedido
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
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-[#212121] px-3 py-2 text-sm font-semibold text-gray-900 hover:brightness-75 sm:mt-0 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <div
                        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      />
                    ) : (
                      <p className="text-white flex items-center gap-2">
                        Confirmar
                      </p>
                    )}
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
