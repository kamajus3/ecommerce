'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

import Button from '@/components/Button'
import Modal from '@/components/Modal'
import constants from '@/constants'
import { useRouter } from '@/navigation'
import { UserRepository } from '@/repositories/user.repository'
import { auth } from '@/services/firebase/config'

export default function AccountDelete() {
  const t = useTranslations('settings')

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openPasswordModal, setPasswordModal] = useState(false)
  const router = useRouter()

  const userRepository = useMemo(() => new UserRepository(), [])

  function deleteAccount() {
    const { currentUser } = auth
    if (currentUser) {
      currentUser
        .delete()
        .then(async () => {
          await userRepository.deleteById(currentUser.uid)
          router.replace('/logout')
        })
        .catch(() => {
          toast.error(t('deleteAccount.error'))
        })
    }
  }

  return (
    <article className="p-10">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          {t('deleteAccount.title')}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {t('deleteAccount.warn')}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <Button
            className="bg-red-500 px-5 py-3"
            onClick={() => {
              setPasswordModal(true)
            }}
          >
            {t('deleteAccount.buttonDeleteAccount')}
          </Button>
        </div>
        <Modal.Dialog
          title={t('deleteAccount.modal.title')}
          description={t('deleteAccount.modal.description')}
          actionTitle={t('deleteAccount.modal.action')}
          themeColor={constants.colors.error}
          action={deleteAccount}
          isOpen={openDeleteModal}
          setOpen={setOpenDeleteModal}
        />

        <Modal.Password
          action={() => {
            setOpenDeleteModal(true)
          }}
          isOpen={openPasswordModal}
          setOpen={setPasswordModal}
        />
      </div>
    </article>
  )
}
