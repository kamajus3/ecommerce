import { Dispatch, Fragment, SetStateAction, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Button from '../Button'
import Link from 'next/link'

interface OrderConfirmedProps {
  orderData: [boolean, string | undefined]
  setOrderData: Dispatch<SetStateAction<[boolean, string | undefined]>>
}

export default function OrderConfirmed(props: OrderConfirmedProps) {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={props.orderData[0]} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={() => {
          props.setOrderData([false, undefined])
        }}
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
                  <div className="sm:flex sm:items-start mx-auto px-5">
                    <article className="mt-2 m-auto w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-3xl font-semibold leading-6 text-black mb-5 my-7"
                      >
                        Parabéns
                      </Dialog.Title>
                      <div className="mb-2">
                        <p className="text-[#575656]">
                          O seu pedido foi realizado com sucesso.
                        </p>
                      </div>
                    </article>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Link href={`/invoice/${props.orderData[1]}`}>
                    <Button
                      type="button"
                      onClick={() => {
                        if (props.orderData[1]) {
                          props.setOrderData([false, undefined])
                        }
                      }}
                    >
                      Baixar a factura
                    </Button>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
