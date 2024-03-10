'use client'

import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import CATEGORIES from '@/assets/data/categories'
import { ProductItem } from '@/@types'
import { Bounce, toast } from 'react-toastify'
import { URLtoFile } from '@/functions'
import Field from '../Field'
import Button from '../Button'

interface FormData {
  name: string
  description: string
  quantity: number
  price: number
  category: string
  photo: Blob
}

interface ProductModalProps {
  title: string
  actionTitle: string
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  action: (data: FormData, oldProduct?: ProductItem) => void | Promise<void>
  defaultProduct?: ProductItem
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

const schema = z.object({
  name: z
    .string()
    .min(6, 'O nome deve ter no minimo 6 caracteres')
    .max(120, 'O nome deve ter no máximo 120 carácteres')
    .trim(),
  description: z
    .string()
    .min(6, 'A descrição deve ter no minimo 6 carácteres')
    .max(180, 'A descrição deve ter no máximo 180 carácteres')
    .trim(),
  quantity: z
    .number({
      required_error: 'Digite a quantidade do producto',
      invalid_type_error: 'A quantidade do producto está invalida',
    })
    .positive('A quantidade deve ser um número positivo')
    .max(10000, 'A quantidade máxima permitida é 10.000'),
  price: z
    .number({
      required_error: 'Digite o preço do producto',
      invalid_type_error: 'A preço do producto está invalido',
    })
    .max(100000000, 'O preço máximo é 100.000.000')
    .positive('O preço deve ser um número positivo'),
  category: z
    .string({
      invalid_type_error: 'Digite uma categória válida',
      required_error: 'A categória é obrigatória',
    })
    .trim(),
  photo: z
    .instanceof(Blob, {
      message: 'A fotografia é obrigatória',
    })
    .refine(
      (file) => file!.size <= 5 * 1024 * 1024,
      'A fotografia deve ter no máximo 5mB',
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Apenas esses tipos são permitidos .jpg, .jpeg, .png',
    ),
})

export default function ProductModal(props: ProductModalProps) {
  const cancelButtonRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (props.defaultProduct?.photo) {
      setPhotoPreview(props.defaultProduct?.photo)
    } else {
      setPhotoPreview(null)
    }
  }, [props.defaultProduct, getValues])

  useEffect(() => {
    async function unsubscribed() {
      if (props.defaultProduct) {
        const photo = await URLtoFile(props.defaultProduct.photo)

        reset(
          {
            ...props.defaultProduct,
            photo,
          },
          {
            keepDefaultValues: true,
            keepDirtyValues: false,
            keepTouched: false,
            keepDirty: false,
          },
        )
      }
    }

    unsubscribed()
  }, [reset, props.defaultProduct])

  function closeModal() {
    props.setOpen(false)
    reset()
    setPhotoPreview('')
  }

  async function onSubmit(data: FormData) {
    if (isDirty) {
      if (props.defaultProduct) {
        await props.action(data, props.defaultProduct)
      } else {
        props.action(data)
      }
      closeModal()
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
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={closeModal}
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
                        {props.title}
                      </Dialog.Title>
                      <div className="mb-4">
                        <Field.Label htmlFor="name">Nome</Field.Label>
                        <Field.Input
                          type="text"
                          {...register('name')}
                          error={errors.name}
                        />
                        <Field.Error error={errors.name} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="quantity">Quantidade</Field.Label>
                        <Field.Input
                          type="number"
                          id="quantity"
                          {...register('quantity', { valueAsNumber: true })}
                          error={errors.quantity}
                        />
                        <Field.Error error={errors.quantity} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="price">Preço</Field.Label>
                        <Field.Input
                          type="number"
                          {...register('price', { valueAsNumber: true })}
                          error={errors.price}
                        />
                        <Field.Error error={errors.price} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="category">Categória</Field.Label>
                        <Field.Select
                          {...register('category')}
                          options={CATEGORIES.map((c) => ({
                            value: c.label,
                            label: c.label,
                          }))}
                          error={errors.category}
                        />
                        <Field.Error error={errors.category} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="description">
                          Descrição
                        </Field.Label>
                        <Field.TextArea
                          {...register('description')}
                          error={errors.description}
                        />
                        <Field.Error error={errors.description} />
                      </div>
                      <div>
                        <Field.DropZone
                          onChange={(e) => {
                            if (
                              e.target.files &&
                              e.target.files?.length !== 0
                            ) {
                              setValue('photo', e.target.files[0])
                              setPhotoPreview(
                                window.URL.createObjectURL(e.target.files[0]),
                              )
                            }
                          }}
                          photoPreview={photoPreview}
                          error={errors.photo}
                        />
                        <Field.Error error={errors.photo} />
                      </div>
                    </article>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                  <Button type="submit" loading={isSubmitting}>
                    {props.actionTitle}
                  </Button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={closeModal}
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
