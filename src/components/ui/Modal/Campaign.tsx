import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { ICampaign, IProductInput } from '@/@types'
import { URLtoFile } from '@/functions'
import { useCampaign } from '@/hooks/useCampaign'
import { ProductRepository } from '@/repositories/product.repository'
import { Dialog, Transition } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'

import Button from '../Button'
import Field from '../Field'
import ProductInput from '../ProductInput'

interface IFormData {
  title: string
  default: boolean
  fixed: boolean
  description: string
  reduction?: string
  startDate?: string
  finishDate?: string
  products?: IProductInput[]
  photo: Blob
}

interface ICampaignModal {
  title: string
  actionTitle: string
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  action: (data: IFormData, oldProduct?: ICampaign) => void | Promise<void>
  defaultData?: ICampaign
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
const PERCENTAGE_REGEX = /^(100|[1-9]?[0-9])$/
const ALLOWED_IMAGE_DIMENSION = [778, 455]

export default function CampaignModal(props: ICampaignModal) {
  const [imageDimension, setImageDimension] = useState([0, 0])
  const [isDefaultState, setDefaultState] = useState(
    !!(props.defaultData && props.defaultData.default),
  )
  const { campaignData } = useCampaign()

  const defaultCampaign = campaignData.find((c) => c.default === true)
  const fixedCampaign = campaignData.find((c) => c.fixed === true)

  const schema = z
    .object({
      title: z
        .string()
        .min(6, 'O título deve ter no mínimo 6 caracteres')
        .max(120, 'O título deve ter no máximo 120 caracteres')
        .trim(),
      default: z.boolean(),
      fixed: z.boolean(),
      description: z
        .string()
        .min(6, 'A descrição deve ter no mínimo 6 caracteres')
        .max(100, 'A descrição deve ter no máximo 100 caracteres')
        .trim(),
      photo: z
        .instanceof(Blob, {
          message: 'A fotografia é obrigatória',
        })
        .refine(
          (file) => file.size <= 5 * 1024 * 1024,
          'A fotografia deve ter no máximo 5MB',
        )
        .refine(
          () =>
            imageDimension[0] === ALLOWED_IMAGE_DIMENSION[0] &&
            imageDimension[1] === ALLOWED_IMAGE_DIMENSION[1],
          `A fotografia precisa ter a resolução (${ALLOWED_IMAGE_DIMENSION[0]} x ${ALLOWED_IMAGE_DIMENSION[1]})`,
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          'Apenas esses tipos são permitidos: .jpg, .jpeg, .png',
        ),
      reduction: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (isDefaultState) {
              return true
            }

            if (value && PERCENTAGE_REGEX.test(value)) {
              return true
            }

            return false
          },
          {
            message: 'A taxa de redução deve ficar entre 0% à 100%',
          },
        ),
      startDate: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (isDefaultState) {
              return true
            }

            if (value && DATETIME_REGEX.test(value)) {
              return true
            }

            return false
          },
          {
            message: 'A data de início está inválida',
          },
        ),
      finishDate: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (isDefaultState) {
              return true
            }

            if (value && DATETIME_REGEX.test(value)) {
              return true
            }

            return false
          },
          {
            message: 'A data de término está inválida',
          },
        ),
      products: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
          {
            required_error: 'Escolha os produtos desta campanha',
          },
        )
        .min(
          !isDefaultState ? 1 : 0,
          'Selecione os produtos que queres promover',
        )
        .max(40, 'O máximo de produtos por campanha é 40'),
    })
    .refine(
      (data) => {
        if (!isDefaultState) {
          if (data.startDate && data.finishDate) {
            const startDate = new Date(data.startDate)
            const finishDate = new Date(data.startDate)

            if (startDate > finishDate) {
              return false
            }
          }
        }
        return true
      },
      {
        message: 'A data de início não pode ser depois da data de termino',
        path: ['startDate'],
      },
    )
    .refine(
      (data) => {
        if (!isDefaultState && data.startDate && data.finishDate) {
          const startDate = new Date(data.startDate)
          const finishDate = new Date(data.finishDate)

          return finishDate >= startDate
        }

        return true
      },
      {
        message: 'A data de término não pode ser antes data de início',
        path: ['finishDate'],
      },
    )

  const cancelButtonRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      default: false,
      fixed: false,
      products: [],
    },
  })
  const productRepository = useMemo(() => new ProductRepository(), [])

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const campaignProducts = watch('products')
  const isDefault = watch('default')
  const isFixed = watch('fixed')

  useEffect(() => {
    if (isDefault) {
      setValue('reduction', '')
      setValue('startDate', '')
      setValue('finishDate', '')
      setValue('products', [])
    }

    setDefaultState(isDefault)
  }, [setValue, isDefault])

  useEffect(() => {
    function handlePhoto() {
      if (props.defaultData?.photo) {
        return props.defaultData?.photo
      }

      return null
    }

    setPhotoPreview(handlePhoto())
  }, [props.defaultData])

  useEffect(() => {
    async function unsubscribed() {
      if (props.defaultData) {
        const products = await productRepository.find({
          filterBy: {
            campaign: props.defaultData.id,
          },
        })

        const finalProducts: IProductInput[] = []

        products.forEach((product) => {
          const newProduct = { id: product.id, name: product.name }
          finalProducts.push(newProduct)
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
  }, [reset, props.defaultData, productRepository])

  function closeModal() {
    props.setOpen(false)
    reset()
    setPhotoPreview('')
  }

  async function onSubmit(data: IFormData) {
    if (!isDirty) {
      toast.warn('Nenhum campo foi alterado')

      return
    }

    const restData = isDefault
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (({ reduction, startDate, finishDate, products, ...rest }) => rest)(
          data,
        )
      : data

    if (props.defaultData) {
      await props.action(restData, props.defaultData)
    } else {
      await props.action(restData)
    }

    closeModal()
  }

  function appendProduct(product: IProductInput) {
    const allProducts = getValues('products')
    if (allProducts) {
      pushProduct(allProducts, product)
    }
  }

  function pushProduct(products: IProductInput[], product: IProductInput) {
    products.push(product)
    setValue('products', products)
  }

  function removeProduct(id: string) {
    const products = getValues('products')
    if (products) {
      const allProducts = products.filter((p) => p.id !== id)
      setValue('products', allProducts)
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
                      {defaultCampaign &&
                        isDefault &&
                        ((props.defaultData &&
                          props.defaultData.id !== defaultCampaign.id) ||
                          (!props.defaultData && defaultCampaign)) && (
                          <div className="bg-red-300 p-2 rounded text-red-500 font-medium mb-4 flex items-center gap-x-2">
                            A campanha selecionada anteriormente como padrão
                            será apagada
                          </div>
                        )}
                      <div className="mb-4">
                        <Field.Label htmlFor="title">Título</Field.Label>
                        <Field.Input
                          type="text"
                          {...register('title')}
                          error={errors.title}
                        />
                        <Field.Error error={errors.title} />
                      </div>

                      <div className="mb-4 flex items-center gap-x-2">
                        <input
                          type="checkbox"
                          id="default"
                          disabled={isFixed === true}
                          defaultChecked={
                            props.defaultData && defaultCampaign
                              ? defaultCampaign?.id === props.defaultData.id
                              : false
                          }
                          {...register('default')}
                        />

                        <Field.Label htmlFor="default">
                          Definir como padrão
                        </Field.Label>
                      </div>

                      <div className="mb-4 flex items-center gap-x-2">
                        <input
                          type="checkbox"
                          id="fixed"
                          disabled={isDefault === true}
                          defaultChecked={
                            props.defaultData && fixedCampaign
                              ? fixedCampaign.id === props.defaultData.id
                              : false
                          }
                          {...register('fixed')}
                        />

                        <Field.Label htmlFor="fixed">
                          Fixar campanha
                        </Field.Label>
                      </div>

                      {!isDefault && (
                        <div className="mb-4">
                          <Field.Label htmlFor="reduction">
                            Taxa de redução
                          </Field.Label>
                          <Field.Input
                            {...register('reduction')}
                            error={errors.reduction}
                          />
                          <Field.Error error={errors.reduction} />
                        </div>
                      )}

                      {!isDefault && (
                        <div>
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
                        </div>
                      )}
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
                      {!isDefault && (
                        <div className="mb-4">
                          <Field.Label htmlFor="products">
                            Productos
                          </Field.Label>
                          <ProductInput
                            products={campaignProducts}
                            appendProduct={appendProduct}
                            removeProduct={removeProduct}
                            campaignId={props?.defaultData?.id}
                            error={!!errors.products}
                          />
                          {campaignProducts && campaignProducts.length > 0 && (
                            <div className="mt-2">
                              {campaignProducts.map((p) => (
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
                      )}
                      <div>
                        <Field.DropZone
                          photoPreview={photoPreview}
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
