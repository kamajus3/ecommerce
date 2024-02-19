'use client'

import products from '@/assets/data/products'
import HeaderBase from '../components/Header/HeaderBase'
import { Product } from '@/@types'
import useCartStore from '@/store/CartStore'
import Image from 'next/image'
import Footer from '../components/Footer'
import Dialog from '../components/Dialog'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast, Bounce } from 'react-toastify'
import useMoneyFormat from '@/hooks/useMoneyFormat'

interface CartProduct extends Product {
  quantity: number
}

interface CartTableRow {
  product: CartProduct
  setOpenDeleteModal: Dispatch<SetStateAction<boolean>>
  openDeleteModal: boolean
  selectedProducts: string[]
  setSelectedProduct: Dispatch<SetStateAction<string[]>>
}

function CartTableRow({
  product,
  openDeleteModal,
  setOpenDeleteModal,
  selectedProducts,
  setSelectedProduct,
}: CartTableRow) {
  const removeFromCart = useCartStore((state) => state.removeProduct)
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
          <input
            type="checkbox"
            checked={!!selectedProducts.find((id) => id === product.id)}
            name="bordered-checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedProduct([...selectedProducts, product.id])
              } else {
                setSelectedProduct(
                  selectedProducts.filter((id) => id !== product.id),
                )
              }
            }}
            className="w-4 h-4 border-gray-300 rounded bg-gray-700 cursor-pointer"
          ></input>
        </div>
      </td>
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
        <Dialog
          title="Remover producto"
          description="Você tem certeza que queres remover esse producto do carinho?"
          actionTitle="Remover"
          action={() => {
            removeFromCart(product.id)
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
  const money = useMoneyFormat()
  const cartProducts = useCartStore((state) => state.products)
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedProducts, setSelectedProduct] = useState(
    cartProducts.map((p) => p.id),
  )

  const finalCartProducts = products.map((p) => {
    const cartProduct = cartProducts.find(
      (cartProduct) => cartProduct.id === p.id,
    )
    if (cartProduct) {
      return { ...p, quantity: cartProduct.quantity }
    }
    return null
  })

  useEffect(() => {
    const selectedProductsTotalPrice = finalCartProducts.reduce(
      (total, product) => {
        if (product && selectedProducts.includes(product.id)) {
          return total + product.price * product.quantity
        }
        return total
      },
      0,
    )

    setTotalPrice(selectedProductsTotalPrice)
  }, [selectedProducts, finalCartProducts])

  useEffect(() => {
    setSelectedProduct(cartProducts.map((p) => p.id))
  }, [cartProducts])

  return (
    <section className="bg-white overflow-hidden">
      <HeaderBase />

      <article className="mb-2 mt-5">
        <p className="text-black font-semibold text-3xl p-9 max-sm:text-center">
          Carrinho de productos
        </p>
      </article>

      <article className="container mx-auto mt-8 mb-8 max-sm:p-9">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-[#dddddd]">
            <thead>
              <tr className="bg-[#F9FAFB] text-gray-600 uppercase text-sm">
                <th className="p-3 capitalize font-semibold text-base text-[#111827] flex items-center gap-x-3 justify-center">
                  <input
                    type="checkbox"
                    id="select-all-products"
                    name="select-all-products"
                    checked={selectedProducts.length === cartProducts.length}
                    className="w-4 h-4 border-gray-300 rounded bg-gray-700 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProduct(cartProducts.map((p) => p.id))
                      } else {
                        setSelectedProduct([])
                      }
                    }}
                  />
                  <label htmlFor="select-all-products" className="select-none">
                    Todos
                  </label>
                </th>
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
                  ?
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {finalCartProducts.map(
                (product) =>
                  product && (
                    <CartTableRow
                      key={product.id}
                      product={product}
                      openDeleteModal={openDeleteModal}
                      setOpenDeleteModal={setOpenDeleteModal}
                      setSelectedProduct={setSelectedProduct}
                      selectedProducts={selectedProducts}
                    />
                  ),
              )}
            </tbody>
          </table>
        </div>
      </article>
      <div className="mt-10 mb-10 p-8 gap-y-5">
        <div className="text-black font-medium text-lg mb-3 flex flex-col gap-3">
          <span className="text-[#5e5f61] ">Total a pagar</span>
          <span className="font-bold text-4xl">{money.format(totalPrice)}</span>
        </div>
        <button className="border border-gray-300 p-4 px-10 mb-3 bg-main text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 select-none">
          Fazer pagamento
        </button>
      </div>
      <Footer />
    </section>
  )
}
