'use client'

import Header from '@/app/components/Header'
import { Product } from '@/@types'
import Image from 'next/image'
import Dialog from '@/app/components/Dialog'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast, Bounce } from 'react-toastify'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import adminProducts from '@/assets/data/products_admin'

interface CartProduct extends Product {
  quantity: number
}

interface CartTableRow {
  product: CartProduct
  setOpenDeleteModal: Dispatch<SetStateAction<boolean>>
  openDeleteModal: boolean
}

function CartTableRow({
  product,
  openDeleteModal,
  setOpenDeleteModal,
}: CartTableRow) {
  const money = useMoneyFormat()

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
            onClick={() => setOpenDeleteModal(true)}
            className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <span className="text-violet-600 font-medium">Editar</span>
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
    </tr>
  )
}

export default function CartPage() {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [editorModal, setOpenEditorModal] = useState(false)
  return (
    <section className="bg-white overflow-hidden">
      <Header.Admin />

      <article className="mb-2 mt-12">
        <p className="text-black font-semibold text-3xl p-9 max-sm:text-center">
          Meus productos
        </p>

        <div className="mb-10 px-8 gap-y-5">
          <button
            onClick={() => {
              setOpenEditorModal(true)
            }}
            className="border border-gray-300 p-4 px-10 mb-3 bg-main text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 select-none max-sm:mx-auto"
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
                  Preço
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Quantidade
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
              {adminProducts.map(
                (product) =>
                  product && (
                    <CartTableRow
                      key={product.id}
                      product={product}
                      openDeleteModal={openDeleteModal}
                      setOpenDeleteModal={setOpenDeleteModal}
                    />
                  ),
              )}
            </tbody>
          </table>
        </div>
      </article>
      <Dialog.Editor
        title="Novo producto"
        actionTitle="Postar"
        isOpen={editorModal}
        setOpen={setOpenEditorModal}
        action={() => {}}
      />
    </section>
  )
}
