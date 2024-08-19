'use client'

import { Dispatch, Fragment, SetStateAction, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import useUserStore from '@/store/UserStore'
import { Dialog, Transition } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'

import Button from '../Button'
import Field from '../Field'

interface IFormData {
  password: string
}

interface IPasswordModal {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  action?: () => void | Promise<void>
  actionWithParam?: (param: string) => void | Promise<void>
  actionParam?: string
}

export default function PasswordModal(props: IPasswordModal) {
  const t = useTranslations()

  const cancelButtonRef = useRef(null)
  const schema = z.object({
    password: z
      .string()
      .min(
        6,
        t('form.errors.minLength', {
          field: `${t('auth.sharedFields.password').toLowerCase()}`,
          length: 6,
        }),
      )
      .max(
        40,
        t('form.errors.maxLength', {
          field: `${t('auth.sharedFields.password').toLowerCase()}`,
          length: 40,
        }),
      ),
  })

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  })

  const user = useUserStore((state) => state.metadata)

  function closeModal() {
    props.setOpen(false)
    reset()
  }

  async function onSubmit(data: IFormData) {
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, data.password)

      reauthenticateWithCredential(user, credential)
        .then(async () => {
          closeModal()
          if (props.actionWithParam && props.actionParam) {
            props.actionWithParam(props.actionParam)
          } else {
            if (props.action) {
              props.action()
            }
          }
        })
        .catch(() => {
          setError(
            'password',
            { type: 'focus', message: t('form.errors.incorrectPassword') },
            { shouldFocus: true },
          )
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
                        className="text-2xl font-semibold leading-9 text-gray-900 mb-8 my-7"
                      >
                        {t('auth.confirmPassword.title')}
                      </Dialog.Title>
                      <div className="mb-4">
                        <Field.Label htmlFor="password">
                          {t('auth.sharedFields.password')}
                        </Field.Label>
                        <Field.Input
                          type="password"
                          {...register('password')}
                          error={errors.password}
                        />
                        <Field.Error error={errors.password} />
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
                    {t('auth.confirmPassword.action')}
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
