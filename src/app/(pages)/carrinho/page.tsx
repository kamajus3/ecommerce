'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Dialog from '../../components/Dialog'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast, Bounce } from 'react-toastify'
import Image from 'next/image'
import { getProduct } from '@/lib/firebase/database'
import { ProductItem } from '@/@types'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import useCartStore from '@/store/CartStore'
import Link from 'next/link'
import { campaignValidator } from '@/functions'

interface CartProduct extends ProductItem {
  quantity: number
}

interface CartTableRowProps {
  product: CartProduct
  selectedProducts: string[]
  setSelectedProduct: Dispatch<SetStateAction<string[]>>
}

function CartTableRow({
  product,
  selectedProducts,
  setSelectedProduct,
}: CartTableRowProps) {
  const removeFromCart = useCartStore((state) => state.removeProduct)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const money = useMoneyFormat()

  const notifyDelete = () =>
    toast.success('Produto removido com sucesso', {
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
        <Link
          href={`/product/${product.id}`}
          className="flex items-center justify-center"
        >
          <Image
            width={70}
            height={70}
            src={product.photo}
            alt={product.name}
            draggable={false}
            className="select-none"
          />
        </Link>
      </td>
      <td className="p-3">
        <div className="text-center text-black font-medium">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
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
          {product.promotion &&
          campaignValidator(product.promotion) === 'promotion'
            ? `${product.promotion?.reduction} %`
            : '-'}
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setOpenDeleteModal(true)}
            className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <span className="text-red-500 font-medium">Remover</span>
          </button>
        </div>
        <Dialog.Delete
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
  const [totalPrice, setTotalPrice] = useState(0)
  const [productData, setProductData] = useState<CartProduct[]>([])
  const [isModalOpened, setModalOpen] = useState(false)

  const cartProducts = useCartStore((state) => state.products)
  const [selectedProducts, setSelectedProduct] = useState(
    cartProducts.map((p) => p.id),
  )
  const money = useMoneyFormat()

  useEffect(() => {
    setSelectedProduct(cartProducts.map((p) => p.id))

    const fetchProducts = async () => {
      const fetchedProducts = await Promise.all(
        cartProducts.map(async (p) => {
          const product = await getProduct(p.id)
          if (product) {
            return {
              ...product,
              id: p.id,
              quantity: p.quantity,
              price:
                product.promotion?.reduction &&
                product.promotion?.reduction !== 0
                  ? product.price -
                    product.price * (product.promotion.reduction / 100)
                  : product.price,
            }
          }
          return null
        }),
      )
      setProductData(fetchedProducts.filter((p) => p !== null) as CartProduct[])
    }

    fetchProducts()
  }, [cartProducts])

  useEffect(() => {
    const selectedProductsTotalPrice = productData.reduce((total, product) => {
      if (product && selectedProducts.includes(product.id)) {
        return total + product.price * product.quantity
      }
      return total
    }, 0)

    setTotalPrice(selectedProductsTotalPrice)
  }, [selectedProducts, cartProducts, productData])

  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
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
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProduct(cartProducts.map((p) => p.id))
                      } else {
                        setSelectedProduct([])
                      }
                    }}
                    className="w-4 h-4 border-gray-300 rounded bg-gray-700 cursor-pointer"
                  />
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
                <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                  Promoção
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  -
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {productData.map((product) => (
                <CartTableRow
                  key={product.id}
                  product={product}
                  setSelectedProduct={setSelectedProduct}
                  selectedProducts={selectedProducts}
                />
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <div className="mt-10 mb-10 p-8 gap-y-5">
        <div className="text-black font-medium text-lg mb-3 flex flex-col gap-3">
          <span className="text-[#5e5f61] ">Total a pagar</span>
          <span className="font-bold text-4xl">{money.format(totalPrice)}</span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="border border-gray-300 p-4 px-10 mb-3 bg-main text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 select-none"
        >
          Confirmar seu pedido
        </button>
      </div>
      <Dialog.ConfirmOrder
        action={() => {}}
        isOpen={isModalOpened}
        setOpen={setModalOpen}
      />
      <Footer />
    </section>
  )
}
