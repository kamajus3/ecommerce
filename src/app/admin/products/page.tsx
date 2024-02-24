'use client'

import Header from '@/app/components/Header'
import { ProductItem } from '@/@types'
import Image from 'next/image'
import Dialog from '@/app/components/Dialog'
import { useEffect, useState } from 'react'
import { toast, Bounce } from 'react-toastify'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { onValue, ref, set, update } from 'firebase/database'
import { database, storage } from '@/config/firebase'
import { randomBytes } from 'crypto'
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
} from 'firebase/storage'
import PublishedSince from '@/app/components/PublishedSince'

interface CartTableRow {
  product: ProductItem
}

interface FormData {
  name: string
  quantity: number
  price: number
  category: string
  photo: Blob
}

function CartTableRow({ product }: CartTableRow) {
  const money = useMoneyFormat()
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const editProduct = (data: FormData) => {
    // const reference = storageRef(storage, `/products/${product.id}`)

    // uploadBytes(reference, data.photo[0]).then(async () => {
    //   const photo = await getDownloadURL(reference)
    // })

    update(ref(database, `/products/${product.id}`), {
      name: data.name,
      quantity: data.quantity,
      price: data.price,
      category: data.category,
      photo: product.photo,
      updatedAt: new Date().toISOString(),
    })
      .then(() => {
        toast.success(`Producto editado com sucesso`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        })
      })
      .catch((error) => {
        toast.error(`Erro a fazer a postagem ${error}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        })
      })
  }

  const notifyDelete = () =>
    toast.success('Producto removido com sucesso', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    })

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
        <div className="text-center text-black font-medium">
          {product.category}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {money.format(product.price)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {product.quantity}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          <PublishedSince date={product.updatedAt} />
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
          title="Remover producto"
          description="Você tem certeza que queres remover esse producto do estoque?"
          actionTitle="Remover"
          action={() => {
            notifyDelete()
          }}
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
        <Dialog.Editor
          title="Editar producto"
          actionTitle="Editar"
          isOpen={openEditModal}
          setOpen={setOpenEditModal}
          action={editProduct}
          defaultProduct={{ ...product }}
        />
      </td>
    </tr>
  )
}

export default function ProductPage() {
  const [blogData, setBlogData] = useState<Record<string, ProductItem>>({})

  const [newModal, setNewModal] = useState(false)

  const postProduct = (data: FormData) => {
    const postId = randomBytes(20).toString('hex')
    const reference = storageRef(storage, `/products/${postId}`)

    uploadBytes(reference, data.photo)
      .then(async () => {
        const photo = await getDownloadURL(reference)
        set(ref(database, 'products/' + postId), {
          name: data.name,
          quantity: data.quantity,
          price: data.price,
          category: data.category,
          photo,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
          .then(() => {
            toast.success(`Producto postada com sucesso`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            })
          })
          .catch((error: string) => {
            toast.error(`Erro a fazer a postagem ${error}`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            })
          })
      })
      .catch((error) => {
        toast.error(`Erro a fazer a postagem ${error}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        })
      })

    setNewModal(false)
  }

  useEffect(() => {
    const blogRef = ref(database, 'products/')
    onValue(blogRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setBlogData(data)
      }
    })
  }, [])

  return (
    <section className="bg-white overflow-hidden min-h-screen">
      <Header.Admin />

      <article className="mb-2 mt-12">
        <p className="text-black font-semibold text-3xl p-9">Meus productos</p>

        <div className="mb-10 px-8 gap-y-5">
          <button
            onClick={() => {
              setNewModal(true)
            }}
            className="border border-gray-300 p-4 px-10 mb-3 bg-main text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 select-none"
          >
            Adicionar producto
          </button>
        </div>
      </article>

      <article className="container mx-auto mt-8 mb-8 max-sm:p-9">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-[#dddddd]">
            <thead>
              <tr className="bg-[#F9FAFB] text-gray-600 uppercase text-sm">
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Foto
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Nome
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Categória
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Preço
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Quantidade
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Atualizado em
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
              {Object.entries(blogData).map(([id, product]) => (
                <CartTableRow key={id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <Dialog.Editor
        title="Novo producto"
        actionTitle="Postar"
        isOpen={newModal}
        setOpen={setNewModal}
        action={postProduct}
      />
    </section>
  )
}
