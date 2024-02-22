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
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface FormData {
  name: string
  quantity: number
  price: number
  photo: FileList
}

interface DialogRootProps {
  title: string
  actionTitle: string
  action: (data: FormData) => void
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  quantity: yup
    .number()
    .typeError('A quantidade deve ser um número')
    .required('A quantidade é obrigatório')
    .positive('A quantidade deve ser um número positivo'),
  price: yup
    .number()
    .typeError('O preço deve ser um número')
    .required('O preço é obrigatório')
    .positive('O preço deve ser um número positivo'),
  photo: yup
    .mixed<FileList>()
    .test(
      'fileRequired',
      'A fotografia é obrigatória',
      (files) => files && files.length > 0,
    )
    .test(
      'fileSize',
      'Fotografias acima de 2mB não são permitidas',
      (files) =>
        !files ||
        files.length === 0 ||
        Array.from(files).every((file) => file.size <= 2_000_000),
    )
    .required('A fotografia é obrigatória'),
})

export default function DialogRoot(props: DialogRootProps) {
  const cancelButtonRef = useRef(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) })

  const watchPhoto = watch('photo')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (watchPhoto && watchPhoto.length > 0) {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPhotoPreview(`${reader.result}`)
        }
      }
      reader.readAsDataURL(watchPhoto[0])
    } else {
      setPhotoPreview(null)
    }
  }, [watchPhoto])

  const onSubmit = (data: FormData) => {
    props.action(data)
    props.setOpen(false)
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
                    <article
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-2 m-auto w-full"
                    >
                      <div className="mb-4">
                        <Dialog.Title
                          as="h3"
                          className="text-2xl font-semibold leading-6 text-gray-900 mb-8 my-7"
                        >
                          {props.title}
                        </Dialog.Title>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nome
                        </label>
                        <input
                          type="text"
                          id="name"
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
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantidade
                        </label>
                        <input
                          type="number"
                          min={1}
                          id="quantity"
                          defaultValue={1}
                          {...register('quantity')}
                          className={`w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.name && 'border-red-500'}`}
                        />
                        {errors.quantity && (
                          <p className="text-red-500 mt-1">
                            {errors.quantity.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Preço
                        </label>
                        <input
                          type="text"
                          id="price"
                          {...register('price')}
                          className={`w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.name && 'border-red-500'}`}
                        />
                        {errors.price && (
                          <p className="text-red-500 mt-1">
                            {errors.price.message}
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
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <input
                            type="file"
                            id="dropzone-file"
                            {...register('photo')}
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
