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
import clsx from 'clsx'
import { Bounce, toast } from 'react-toastify'
import { URLtoFile } from '@/functions'
import ProductInput from '../ProductInput'
import { Percent, X } from 'lucide-react'
import { getProducts } from '@/lib/firebase/database'
import { useInformation } from '@/hooks/useInformation'

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

interface DialogRootProps {
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
    .max(70, 'A descrição deve ter no máximo 70 carácteres')
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

export default function DialogRoot(props: DialogRootProps) {
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

  async function onSubmit(data: FormData) {
    if (isDirty) {
      reset({
        title: '',
        description: '',
        startDate: '',
        fixed: false,
        finishDate: '',
        photo: '',
        products: [],
        reduction: 0,
      })
      if (props.defaultData) {
        await props.action(data, props.defaultData)
      } else {
        props.action(data)
      }
      props.setOpen(false)
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
                        {props.title}
                      </Dialog.Title>
                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Título
                        </label>
                        <input
                          type="text"
                          id="title"
                          {...register('title')}
                          className={`w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.title && 'border-red-500'}`}
                        />
                        {errors.title && (
                          <p className="text-red-500 mt-1">
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="reduction"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Taxa de redução
                        </label>
                        <div
                          className={`w-full rounded-lg bg-white mt-2 px-3 py-2 border flex items-center gap-2 ${errors.reduction && 'border-red-500'}`}
                        >
                          <Percent size={15} color="#6B7280" />
                          <input
                            type="number"
                            id="reduction"
                            defaultValue={0}
                            {...register('reduction', { valueAsNumber: true })}
                            className="w-[90%] text-gray-500 bg-white outline-none"
                          />
                        </div>

                        {errors.reduction && (
                          <p className="text-red-500 mt-1">
                            {errors.reduction.message}
                          </p>
                        )}
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
                          className="w-[90%] text-gray-500 bg-white outline-none"
                        />

                        <label
                          htmlFor="fixed"
                          className="block text-sm font-medium text-gray-700"
                        >
                          fixar campanha
                        </label>

                        {errors.reduction && (
                          <p className="text-red-500 mt-1">
                            {errors.reduction.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="start-date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Início da campanha
                        </label>
                        <input
                          type="datetime-local"
                          id="startDate"
                          {...register('startDate')}
                          className={`w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.startDate && 'border-red-500'}`}
                        />
                        {errors.startDate && (
                          <p className="text-red-500 mt-1">
                            {errors.startDate.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="start-date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Fim da campanha
                        </label>
                        <input
                          type="datetime-local"
                          id="finishDate"
                          {...register('finishDate')}
                          className={`w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.finishDate && 'border-red-500'}`}
                        />
                        {errors.finishDate && (
                          <p className="text-red-500 mt-1">
                            {errors.finishDate.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Descrição
                        </label>
                        <textarea
                          id="description"
                          {...register('description')}
                          className={`w-full rounded-lg h-40 resize-none bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.description && 'border-red-500'}`}
                        />
                        {errors.description && (
                          <p className="text-red-500 mt-1">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="products"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Productos
                        </label>
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
                        {errors.products && (
                          <p className="text-red-500 mt-1">
                            {errors.products.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          style={{
                            backgroundImage: `url(${photoPreview})`,
                            backgroundSize: 'cover',
                          }}
                          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:brightness-95 ${errors.photo && 'border-red-500 bg-red-100'}`}
                        >
                          <div
                            className={clsx(
                              'flex flex-col items-center justify-center pt-5 pb-6',
                              {
                                hidden: photoPreview,
                              },
                            )}
                          >
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 text-center">
                              <span className="font-semibold">
                                Clique para fazer upload
                              </span>
                              <br />
                              ou arrasta e larga
                            </p>
                          </div>
                          <input
                            type="file"
                            id="dropzone-file"
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
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                      {errors.photo && (
                        <p className="text-red-500 mt-1">
                          {errors.photo.message}
                        </p>
                      )}
                    </article>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-75 sm:ml-3 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <div
                        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      />
                    ) : (
                      <p className="text-white">{props.actionTitle}</p>
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
