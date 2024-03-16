'use client'

import Button from '@/app/components/Button'
import Modal from '@/app/components/Modal'
import { auth, database } from '@/lib/firebase/config'
import { ref, remove } from 'firebase/database'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bounce, toast } from 'react-toastify'

export default function AccountDelete() {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openPasswordModal, setPasswordModal] = useState(false)
  const router = useRouter()

  function deleteAccount() {
    if (auth.currentUser) {
      const databaseReference = ref(database, `users/${auth.currentUser.uid}`)

      auth.currentUser
        ?.delete()
        .then(async () => {
          await remove(databaseReference).catch(() => {})
          router.replace('/')
        })
        .catch(() => {
          toast.error('Erro ao tentar apagar a sua conta', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          })
        })
    }
  }

  return (
    <article className="flex items-center justify-center p-12 border-t border-gray-900/10">
      <Button
        className="bg-red-500 px-5 py-3"
        onClick={() => {
          setPasswordModal(true)
        }}
      >
        <Trash />
        Apagar a conta
      </Button>
      <Modal.Dialog
        title="Apagar a conta (acção irreversível)"
        description="Você tem certeza que queres apagar a sua conta definitivamente? Obs: Os seus pedidos não serão cancelados apagando a sua conta"
        actionTitle="Apagar"
        mainColor="#dc2626"
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
    </article>
  )
}
