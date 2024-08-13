'use client'

import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { IProduct } from '@/@types'
import CATEGORIES from '@/assets/data/categories'
import { URLtoFile } from '@/functions'
import { Dialog, Transition } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'

import Button from '../Button'
import Field from '../Field'

interface IFormData {
  name: string
  description: string
  quantity: number
  price: number
  category: string
  photo: Blob
}

interface IProductModal {
  title: string
  actionTitle: string
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  action: (data: IFormData, oldProduct?: IProduct) => void | Promise<void>
  defaultProduct?: IProduct
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const ALLOWED_IMAGE_DIMENSION = [700, 700]

export default function ProductModal(props: IProductModal) {
  const [imageDimension, setImageDimension] = useState([0, 0])

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
        (file) => file!.size <= 3 * 1024 * 1024,
        'A fotografia deve ter no máximo 3mb',
      )
      .refine(
        () =>
          imageDimension[0] === ALLOWED_IMAGE_DIMENSION[0] &&
          imageDimension[1] === ALLOWED_IMAGE_DIMENSION[1],
        `A fotografia precisa ter a resolução (${ALLOWED_IMAGE_DIMENSION[0]} x ${ALLOWED_IMAGE_DIMENSION[1]})`,
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Apenas esses tipos são permitidos .jpg, .jpeg, .png',
      ),
  })

  const cancelButtonRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (props.defaultProduct?.photo) {
      setPhotoPreview(props.defaultProduct.photo)
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

  async function onSubmit(data: IFormData) {
    if (isDirty) {
      if (props.defaultProduct) {
        await props.action(data, props.defaultProduct)
      } else {
        props.action(data)
      }
      closeModal()
    } else {
      toast.warn('Nenhum campo foi alterado')
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
                          className="w-full"
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
                          supportedImageResolution={ALLOWED_IMAGE_DIMENSION}
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
                          setImageDimension={setImageDimension}
                          error={errors.photo}
                        />
                        <Field.Error error={errors.photo} />
                      </div>
                    </article>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                  <Button
                    className="w-auto max-sm:w-full"
                    type="submit"
                    loading={isSubmitting}
                  >
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
