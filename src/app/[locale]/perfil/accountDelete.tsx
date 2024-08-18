'use client'

import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import constants from '@/constants'
import { useRouter } from '@/navigation'
import { UserRepository } from '@/repositories/user.repository'
import { auth } from '@/services/firebase/config'

export default function AccountDelete() {
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
          toast.error('Erro ao tentar apagar a sua conta')
        })
    }
  }

  return (
    <article className="p-10">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Apagar conta
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Delete permanentemente a sua conta pessoal e todo o seu conteúdo do
          Poubelle. Esta ação não é reversível, por isso proceda com precaução.
          (os seus pedidos não serão cancelados)
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <Button
            className="bg-red-500 px-5 py-3"
            onClick={() => {
              setPasswordModal(true)
            }}
          >
            Apagar a conta
          </Button>
        </div>
        <Modal.Dialog
          title="Apagar a conta (acção irreversível)"
          description="Você tem certeza que queres apagar a sua conta definitivamente? Obs: Os seus pedidos não serão cancelados apagando a sua conta"
          actionTitle="Apagar"
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