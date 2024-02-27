'use client'

import Header from '@/app/components/Header'
import { ProductItem } from '@/@types'
import Image from 'next/image'
import Dialog from '@/app/components/Dialog'
import { useEffect, useState } from 'react'
import { toast, Bounce } from 'react-toastify'
import { onValue, ref, remove, set, update } from 'firebase/database'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { database, storage } from '@/lib/firebase/config'
import { randomBytes } from 'crypto'
import { URLtoFile, publishedSince } from '@/functions'

interface FormData {
  title: string
  startDate: string
  finishDate: string
  description: string
  photo: Blob
}

interface TableRow {
  product: ProductItem
  deletePromotion(): void
  editPromotion(data: FormData, oldProduct?: ProductItem): Promise<void>
}

function TableRow({ product, deletePromotion, editPromotion }: TableRow) {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  return (
    <tr className="border-y border-gray-200 border-y-[#dfdfdf]">
      <td className="p-3">
        <div className="flex items-center justify-center">
          <Image
            width={70}
            height={70}
            src={product.photo}
            alt={product.name}
            draggable={false}
            className="select-none"
          />
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-black font-medium">{product.name}</div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {publishedSince(product.updatedAt)}
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setOpenDeleteModal(true)}
            className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <span className="text-red-500 font-medium">Apagar</span>
          </button>
        </div>
        <Dialog.Delete
          title="Apagar a campanha"
          description="Você tem certeza que queres apagar essa promoção?"
          actionTitle="Remover"
          action={deletePromotion}
          isOpen={openDeleteModal}
          setOpen={setOpenDeleteModal}
        />
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setOpenEditModal(true)}
            className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <span className="text-violet-600 font-medium">Editar</span>
          </button>
        </div>
        <Dialog.Promotion
          title="Editar campanha"
          actionTitle="Editar"
          isOpen={openEditModal}
          setOpen={setOpenEditModal}
          action={editPromotion}
          defaultProduct={{ ...product }}
        />
      </td>
    </tr>
  )
}

export default function PromotionPage() {
  const [promotionData, setPromotionData] = useState<
    Record<string, ProductItem>
  >({})

  const [newModal, setNewModal] = useState(false)

  function postProduct(data: FormData) {
    const postId = randomBytes(20).toString('hex')
    const reference = storageRef(storage, `/promotions/${postId}`)

    uploadBytes(reference, data.photo)
      .then(async () => {
        const photo = await getDownloadURL(reference)
        set(ref(database, 'promotions/' + postId), {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          finishDate: data.finishDate,
          photo,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
          .then(() => {
            toast.success(`Campanha postada com sucesso`, {
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
          .catch((error: string) => {
            toast.error(`Erro a fazer a campanha ${error}`, {
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
      })
      .catch((error) => {
        toast.error(`Erro a fazer a campanha ${error}`, {
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

  async function editPromotion(data: FormData, oldProduct?: ProductItem) {
    if (oldProduct && oldProduct.id) {
      const reference = storageRef(storage, `/promotions/${oldProduct.id}`)
      const oldPhoto = await URLtoFile(oldProduct.photo)

      if (oldPhoto !== data.photo) {
        await uploadBytes(reference, data.photo)
      }

      update(ref(database, `/promotions/${oldProduct.id}`), {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        finishDate: data.finishDate,
        photo: oldProduct.photo,
        updatedAt: new Date().toISOString(),
      })
        .then(() => {
          toast.success(`Campanha editada com sucesso`, {
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
        .catch((error) => {
          toast.error(`Erro a criar a campanha ${error}`, {
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
    } else {
      toast.error(`Erro a editar a campanha`, {
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
    }
  }

  async function deletePromotion(id: string) {
    const databaseReference = ref(database, `promotions/${id}`)
    const storageReference = storageRef(storage, `promotions/${id}`)

    try {
      await remove(databaseReference)
      await deleteObject(storageReference)
      toast.success(`Campanha eliminado com sucesso`, {
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
    } catch (error) {
      toast.error(`Erro a apagar a campanha`, {
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
    }
  }

  useEffect(() => {
    const reference = ref(database, 'promotions/')
    onValue(reference, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setPromotionData(data)
      }
    })
  }, [])

  return (
    <section className="bg-white overflow-hidden min-h-screen">
      <Header.Admin />

      <article className="mb-2 mt-12">
        <p className="text-black font-semibold text-3xl p-9">
          Minhas campanhas
        </p>

        <div className="mb-10 px-8 gap-y-5">
          <button
            onClick={() => {
              setNewModal(true)
            }}
            className="border border-gray-300 p-4 px-10 mb-3 bg-main text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 select-none"
          >
            Criar uma campanha
          </button>
        </div>
      </article>

      <article className="container mx-auto mt-8 mb-8 max-sm:p-9">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-[#dddddd]">
            <thead>
              <tr className="bg-[#F9FAFB] text-gray-600 uppercase text-sm">
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Capa
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Titulo
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Início
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Termino
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Nº
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  -
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  -
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {Object.entries(promotionData).map(([id, promotion]) => (
                <TableRow
                  key={id}
                  product={{
                    ...promotion,
                    id,
                  }}
                  deletePromotion={() => {
                    deletePromotion(id)
                  }}
                  editPromotion={editPromotion}
                />
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <Dialog.Promotion
        title="Nova campanha"
        actionTitle="Postar"
        isOpen={newModal}
        setOpen={setNewModal}
        action={postProduct}
      />
    </section>
  )
}
