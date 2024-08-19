'use client'

import { Dispatch, Fragment, SetStateAction, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { IProduct } from '@/@types'
import useUserStore from '@/store/UserStore'
import { Dialog, Transition } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'

import Button from '../Button'
import Field from '../Field'

interface IFormData {
  firstName: string
  lastName: string
  address: string
  phone: string
}

interface ICartProduct extends IProduct {
  quantity: number
}

interface IOrder {
  title: string
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  action: (data: IFormData) => void | Promise<void>
  selectedProducts: string[]
  productData: ICartProduct[]
}

export default function Order(props: IOrder) {
  const t = useTranslations()
  const cancelButtonRef = useRef(null)

  const schema = z.object({
    firstName: z
      .string()
      .min(
        2,
        t('form.errors.minLength', {
          field: `${t('settings.perfilUpdate.fields.firstName').toLowerCase()}`,
          length: 2,
        }),
      )
      .max(
        40,
        t('form.errors.maxLength', {
          field: `${t('settings.perfilUpdate.fields.firstName').toLowerCase()}`,
          length: 40,
        }),
      )
      .trim(),
    lastName: z
      .string()
      .min(
        2,
        t('form.errors.minLength', {
          field: `${t('settings.perfilUpdate.fields.lastName').toLowerCase()}`,
          length: 2,
        }),
      )
      .max(
        40,
        t('form.errors.maxLength', {
          field: `${t('settings.perfilUpdate.fields.lastName').toLowerCase()}`,
          length: 40,
        }),
      )
      .trim(),
    address: z
      .string({
        required_error: t('form.errors.required', {
          field: `${t('settings.perfilUpdate.fields.address').toLowerCase()}`,
        }),
      })
      .min(
        10,
        t('form.errors.minLength', {
          field: `${t('settings.perfilUpdate.fields.address').toLowerCase()}`,
          length: 10,
        }),
      )
      .trim(),
    phone: z
      .string({
        required_error: t('form.errors.required', {
          field: `${t('settings.contactUpdate.fields.phone').toLowerCase()}`,
        }),
      })
      .regex(
        /^(?:\+244)?\d{9}$/,
        t('form.errors.invalid', {
          field: `${t('settings.contactUpdate.fields.phone').toLowerCase()}`,
        }),
      ),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  })

  const userDB = useUserStore((state) => state.data)

  function onSubmit(data: IFormData) {
    props.setOpen(false)
    props.action(data)
  }

  useEffect(() => {
    if (userDB) {
      reset(userDB)
    }
  }, [reset, userDB])

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
                        <Field.Label htmlFor="firstName">
                          {t('settings.perfilUpdate.fields.firstName')}
                        </Field.Label>
                        <Field.Input
                          type="text"
                          {...register('firstName')}
                          error={errors.firstName}
                        />
                        <Field.Error error={errors.firstName} />
                      </div>

                      <div className="mb-4">
                        <Field.Label htmlFor="lastName">
                          {t('settings.perfilUpdate.fields.lastName')}
                        </Field.Label>
                        <Field.Input
                          type="text"
                          {...register('lastName')}
                          error={errors.lastName}
                        />
                        <Field.Error error={errors.lastName} />
                      </div>

                      <div className="mb-4">
                        <Field.Label htmlFor="phone">
                          {t('settings.contactUpdate.fields.phone')}
                        </Field.Label>
                        <Field.Input
                          type="tel"
                          {...register('phone')}
                          error={errors.phone}
                        />
                        <Field.Error error={errors.phone} />
                      </div>

                      <div className="mb-4">
                        <Field.Label htmlFor="address">
                          {t('settings.perfilUpdate.fields.address')}
                        </Field.Label>
                        <Field.Input
                          type="text"
                          id="address"
                          autoComplete="street-address"
                          {...register('address')}
                          error={errors.address}
                        />
                        <Field.Error error={errors.address} />
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
                    {t('settings.buttonContinue')}
                  </Button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => props.setOpen(false)}
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
