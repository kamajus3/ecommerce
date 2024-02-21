import { Dispatch, Fragment, SetStateAction, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ProductCart } from '@/@types'

interface ProductDialogProps {
  product?: ProductCart
  title: string
  actionTitle: string
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function ProductDialog(props: ProductDialogProps) {
  const cancelButtonRef = useRef(null)

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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {props.title}
                      </Dialog.Title>
                      {/* Form fields */}
                      <form className="mt-2">
                        <div className="mb-4">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Nome
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="p-2 block w-full border-gray-300 rounded-md bg-neutral-100 mt-2 px-3 py-2 text-gray-500"
                          />
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
                            id="quantity"
                            className="p-2 block w-full border-gray-300 rounded-md bg-neutral-100 mt-2 px-3 py-2 text-gray-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Preço
                          </label>
                          <input
                            type="number"
                            id="name"
                            className="p-2 block w-full border-gray-300 rounded-md bg-neutral-100 mt-2 px-3 py-2 text-gray-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Fotografia
                          </label>
                          <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      props.setOpen(false)
                    }}
                  >
                    {props.actionTitle}
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
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
