'use client'

import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'
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
  defaultData?: IProduct
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const ALLOWED_IMAGE_DIMENSION = [700, 700]

export default function ProductModal(props: IProductModal) {
  const [imageDimension, setImageDimension] = useState([0, 0])

  const t = useTranslations()

  const schema = z.object({
    name: z
      .string()
      .min(
        6,
        t('form.errors.minLength', {
          field: `${t('admin.product.table.header.name').toLowerCase()}`,
          length: 6,
        }),
      )
      .max(
        120,
        t('form.errors.maxLength', {
          field: `${t('admin.product.table.header.name').toLowerCase()}`,
          length: 120,
        }),
      )
      .trim(),
    description: z
      .string()
      .min(
        6,
        t('form.errors.minLength', {
          field: `${t('admin.product.table.header.description').toLowerCase()}`,
          length: 6,
        }),
      )
      .max(
        180,
        t('form.errors.maxLength', {
          field: `${t('admin.product.table.header.description').toLowerCase()}`,
          length: 180,
        }),
      )
      .trim(),
    quantity: z
      .number({
        required_error: t('form.errors.invalid', {
          field: `${t('admin.product.table.header.quantity').toLowerCase()}`,
        }),
        invalid_type_error: t('form.errors.invalid', {
          field: `${t('admin.product.table.header.quantity').toLowerCase()}`,
        }),
      })
      .positive(
        t('form.errors.positive', {
          field: `${t('admin.product.table.header.quantity').toLowerCase()}`,
        }),
      )
      .max(
        10000,
        t('form.errors.maxLength', {
          field: `${t('admin.product.table.header.quantity').toLowerCase()}`,
          length: 10000,
        }),
      ),
    price: z
      .number({
        required_error: t('form.errors.required', {
          field: `${t('admin.product.table.header.price').toLowerCase()}`,
        }),
        invalid_type_error: t('form.errors.invalid', {
          field: `${t('admin.product.table.header.category').toLowerCase()}`,
        }),
      })
      .max(
        100000000,
        t('form.errors.maxLength', {
          field: `${t('admin.product.table.header.price').toLowerCase()}`,
          length: 100000000,
        }),
      )
      .positive(
        t('form.errors.positive', {
          field: `${t('admin.product.table.header.quantity').toLowerCase()}`,
        }),
      ),
    category: z
      .string({
        invalid_type_error: t('form.errors.invalid', {
          field: `${t('admin.product.table.header.category').toLowerCase()}`,
        }),
        required_error: t('form.errors.required', {
          field: `${t('admin.product.table.header.category').toLowerCase()}`,
        }),
      })
      .trim(),
    photo: z
      .instanceof(Blob, {
        message: t('form.errors.required', {
          field: `${t('admin.product.table.header.photo').toLowerCase()}`,
        }),
      })
      .refine(
        (file) => file!.size <= 3 * 1024 * 1024,
        t('form.errors.maxSize', {
          field: `${t('admin.product.table.header.photo').toLowerCase()}`,
          size: '3MB',
        }),
      )
      .refine(
        () =>
          imageDimension[0] === ALLOWED_IMAGE_DIMENSION[0] &&
          imageDimension[1] === ALLOWED_IMAGE_DIMENSION[1],
        t('form.errors.resolution', {
          field: `${t('admin.product.table.header.photo').toLowerCase()}`,
          x: ALLOWED_IMAGE_DIMENSION[0],
          y: ALLOWED_IMAGE_DIMENSION[1],
        }),
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        t('form.errors.allowedTypes'),
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
    if (props.defaultData?.photo) {
      setPhotoPreview(props.defaultData.photo)
    } else {
      setPhotoPreview(null)
    }
  }, [props.defaultData, getValues])

  useEffect(() => {
    async function unsubscribed() {
      if (props.defaultData) {
        const photo = await URLtoFile(props.defaultData.photo)

        reset(
          {
            ...props.defaultData,
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
  }, [reset, props.defaultData])

  function closeModal() {
    props.setOpen(false)
    reset()
    setPhotoPreview('')
  }

  async function onSubmit(data: IFormData) {
    if (isDirty) {
      if (props.defaultData) {
        await props.action(data, props.defaultData)
      } else {
        props.action(data)
      }
      closeModal()
    } else {
      toast.warn(t('form.noFieldChanged'))
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
                        <Field.Label htmlFor="name">
                          {t('admin.product.table.header.name')}
                        </Field.Label>
                        <Field.Input
                          type="text"
                          {...register('name')}
                          error={errors.name}
                        />
                        <Field.Error error={errors.name} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="quantity">
                          {t('admin.product.table.header.quantity')}
                        </Field.Label>
                        <Field.Input
                          type="number"
                          id="quantity"
                          {...register('quantity', { valueAsNumber: true })}
                          error={errors.quantity}
                        />
                        <Field.Error error={errors.quantity} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="price">
                          {t('admin.product.table.header.price')}
                        </Field.Label>
                        <Field.Input
                          type="number"
                          {...register('price', { valueAsNumber: true })}
                          error={errors.price}
                        />
                        <Field.Error error={errors.price} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="category">
                          {t('admin.product.table.header.category')}
                        </Field.Label>
                        <Field.Select
                          {...register('category')}
                          options={CATEGORIES.map((c) => ({
                            value: c.label,
                            label: t(`categories.labels.${c.label}`),
                          }))}
                          error={errors.category}
                          className="w-full"
                        />
                        <Field.Error error={errors.category} />
                      </div>
                      <div className="mb-4">
                        <Field.Label htmlFor="description">
                          {t('admin.product.table.header.description')}
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
                    {t('form.cancel')}
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
