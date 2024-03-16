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
import { ProductInputProps, PromotionItemEdit } from '@/@types'
import { Bounce, toast } from 'react-toastify'
import { URLtoFile } from '@/functions'
import ProductInput from '../ProductInput'
import { X } from 'lucide-react'
import { getProducts } from '@/lib/firebase/database'
import { useInformation } from '@/hooks/useInformation'
import Field from '../Field'
import Button from '../Button'

interface FormData {
  title: string
  fixed: boolean
  reduction: number
  startDate: string
  finishDate: string
  description: string
  products: ProductInputProps[]
  photo: Blob
}

interface PromotionModalProps {
  title: string
  actionTitle: string
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  action: (
    data: FormData,
    oldProduct?: PromotionItemEdit,
  ) => void | Promise<void>
  defaultData?: PromotionItemEdit
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

const schema = z.object({
  title: z
    .string()
    .min(6, 'O título deve ter no minimo 6 caracteres')
    .max(120, 'O título deve ter no máximo 120 carácteres')
    .trim(),
  reduction: z
    .number({
      required_error: 'Digite a taxa de redução',
      invalid_type_error: 'A taxa de redução está invalida',
    })
    .min(0, 'A taxa não pode ser inferior à 0')
    .max(100, 'A taxa não pode ser inferior à 100'),
  startDate: z
    .string({
      required_error: 'A data de início é obrigatória',
      invalid_type_error: 'A data de início está invalida',
    })
    .regex(DATETIME_REGEX, 'A data de início está invalida'),
  fixed: z.boolean(),
  finishDate: z
    .string({
      required_error: 'A data de termino é obrigatória',
      invalid_type_error: 'A data de termino está invalida',
    })
    .regex(DATETIME_REGEX, 'A data de termino está invalida'),
  description: z
    .string()
    .min(6, 'A descrição me deve ter no minimo 6 carácteres')
    .max(100, 'A descrição deve ter no máximo 100 carácteres')
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
  products: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
      {
        required_error: 'Escolha os productos desta campanha',
      },
    )
    .min(1, 'O mínimo de productos por campanha é 1')
    .max(40, 'O máximo de productos por campanha é 40'),
})

export default function PromotionModal(props: PromotionModalProps) {
  const cancelButtonRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      products: [],
    },
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const { informationsData } = useInformation()
  const promotionProducts = watch('products')

  useEffect(() => {
    if (props.defaultData?.photo) {
      setPhotoPreview(props.defaultData?.photo)
    } else {
      setPhotoPreview(null)
    }
  }, [props.defaultData, getValues])

  useEffect(() => {
    async function unsubscribed() {
      if (props.defaultData) {
        const products = await getProducts({
          promotion: props.defaultData.id,
        })

        const finalProducts: ProductInputProps[] = []

        Object.entries(products).map(([id, product]) => {
          const promotion = {
            id,
            name: product.name,
          }

          finalProducts.push(...finalProducts, promotion)
          return promotion
        })

        const photo = await URLtoFile(props.defaultData.photo)

        reset(
          {
            ...props.defaultData,
            products: finalProducts,
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
  }, [reset, props.defaultData, getValues])

  function closeModal() {
    props.setOpen(false)
    reset()
    setPhotoPreview('')
  }

  async function onSubmit(data: FormData) {
    if (isDirty) {
      if (props.defaultData) {
        await props.action(data, props.defaultData)
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

  function appendProduct(product: ProductInputProps) {
    const allProducts = getValues('products')
    pushProduct(allProducts, product)
  }

  function pushProduct(
    products: ProductInputProps[],
    product: ProductInputProps,
  ) {
    products.push(product)
    setValue('products', products)
  }

  function removeProduct(id: string) {
    const allProducts = getValues('products').filter((p) => p.id !== id)
    setValue('products', allProducts)
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
                        <Field.Label htmlFor="title">Título</Field.Label>
                        <Field.Input
                          type="text"
                          {...register('title')}
                          error={errors.title}
                        />
                        <Field.Error error={errors.title} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="reduction">
                          Taxa de redução
                        </Field.Label>
                        <Field.Input
                          type="number"
                          {...register('reduction', { valueAsNumber: true })}
                          error={errors.reduction}
                        />
                        <Field.Error error={errors.reduction} />
                      </div>
                      <div className="mb-4 flex items-center gap-x-2">
                        <input
                          type="checkbox"
                          id="fixed"
                          defaultChecked={
                            props.defaultData
                              ? informationsData.promotionFixed ===
                                props.defaultData.id
                              : false
                          }
                          {...register('fixed')}
                        />

                        <Field.Label htmlFor="fixed">
                          fixar campanha
                        </Field.Label>
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="startDate">
                          Início da campanha
                        </Field.Label>
                        <Field.Input
                          type="datetime-local"
                          {...register('startDate')}
                          error={errors.startDate}
                        />
                        <Field.Error error={errors.startDate} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="finishDate">
                          Fim da campanha
                        </Field.Label>
                        <Field.Input
                          type="datetime-local"
                          {...register('finishDate')}
                          error={errors.finishDate}
                        />
                        <Field.Error error={errors.finishDate} />
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
                      <div className="mb-4">
                        <Field.Label htmlFor="products">Productos</Field.Label>
                        <ProductInput
                          products={promotionProducts}
                          appendProduct={appendProduct}
                          removeProduct={removeProduct}
                          promotionId={props?.defaultData?.id}
                          error={!!errors.products}
                        />
                        {promotionProducts && promotionProducts.length > 0 && (
                          <div className="mt-2">
                            {promotionProducts.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between relative py-3 bg-white text-sm text-gray-800 select-none"
                              >
                                <p className="text-black">{p.name}</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeProduct(p.id)
                                  }}
                                  className="py-3 pl-3 rounded-full"
                                >
                                  <X
                                    className="left-4 "
                                    color="#000"
                                    size={15}
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <Field.Error error={errors.products} />
                      </div>
                      <div>
                        <Field.DropZone
                          photoPreview={photoPreview}
                          supportedImageResolution={[778, 455]}
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
