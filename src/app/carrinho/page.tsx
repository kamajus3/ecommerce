'use client'

import Header from '../../components/Header'
import Modal from '../../components/Modal'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast, Bounce } from 'react-toastify'
import Image from 'next/image'
import { getProduct } from '@/lib/firebase/database'
import { ProductItem, ProductOrder } from '@/@types'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import useCartStore from '@/store/CartStore'
import Link from 'next/link'
import { campaignValidator } from '@/functions'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ref, set } from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { nanoid } from 'nanoid'
import DataState from '@/components/DataState'
import Button from '@/components/Button'

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
          href={`/producto/${product.id}`}
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
          <Link href={`/producto/${product.id}`}>{product.name}</Link>
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {money.format(product.price)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          x{product.quantity}
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
        <Modal.Dialog
          title="Remover producto"
          description="Você tem certeza que queres remover esse producto do carinho?"
          actionTitle="Remover"
          mainColor="#dc2626"
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
  const removeFromCart = useCartStore((state) => state.removeProduct)
  const [totalPrice, setTotalPrice] = useState(0)
  const [productData, setProductData] = useState<CartProduct[]>([])

  // Modals
  const [isModalOpened, setModalOpen] = useState(false)
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [confirmOrderModal, setConfirmOrderModal] = useState(false)
  const [orderConfirmedModal, setOrderConfirmedModal] = useState<
    [boolean, string | undefined]
  >([false, undefined])

  const [orderData, setOrderData] = useState({})
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { user, initialized } = useAuth()

  const cartProducts = useCartStore((state) => state.products)
  const [selectedProducts, setSelectedProduct] = useState<string[]>([])
  const money = useMoneyFormat()

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts: CartProduct[] = []

      if (cartProducts.length > 0) {
        for (const p of cartProducts) {
          await getProduct(p.id).then((product) => {
            if (product) {
              const productPrice =
                product.promotion?.reduction &&
                product.promotion?.reduction !== 0
                  ? product.price -
                    product.price * (product.promotion.reduction / 100)
                  : product.price

              fetchedProducts.push({
                ...product,
                id: p.id,
                quantity: p.quantity,
                price: productPrice,
              })
            }
          })
        }

        setProductData(fetchedProducts)
      } else {
        setProductData([])
      }
    }

    setLoading(false)
    fetchProducts()
  }, [cartProducts])

  useEffect(() => {
    const selectedTotalPrice = productData.reduce((total, product) => {
      if (product && selectedProducts.includes(product.id)) {
        return total + product.price * product.quantity
      }
      return total
    }, 0)

    setTotalPrice(selectedTotalPrice)
  }, [selectedProducts, cartProducts, productData])

  interface FormData {
    firstName: string
    lastName: string
    address: string
    phone: string
  }

  async function createOrder() {
    const orderId = nanoid(10)

    if (user) {
      await set(ref(database, `orders/${orderId}`), orderData)
        .then(() => {
          selectedProducts.map((id) => removeFromCart(id))
          setSelectedProduct([])
          setOrderConfirmedModal([true, orderId])
        })
        .catch(() => {
          toast.error('Houve um erro ao tentar fazer o teu pedido', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          })
        })
    }
  }

  async function confirmOrder(data: FormData) {
    const productsList: ProductOrder[] = []

    for (const id of selectedProducts) {
      const product = await getProduct(id)
      const cartProduct = cartProducts.find((p) => p.id === id)

      if (product && cartProduct) {
        productsList.push({
          id,
          name: product.name,
          quantity: cartProduct.quantity,
          price: product.price,
          promotion: product.promotion?.reduction || null,
        })
      }
    }

    if (user && productsList.length > 0) {
      setOrderData({
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phone: data.phone,
        userId: user.uid,
        state: 'not-sold',
        createdAt: new Date().toISOString(),
        products: productsList,
      })

      setConfirmOrderModal(true)
    } else {
      toast.error('Houve um erro ao tentar fazer o teu pedido', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    }
  }

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Client />
      <article className="mb-2 mt-5">
        <p className="text-black font-semibold text-3xl p-9 max-sm:text-center">
          Carrinho de productos
        </p>
      </article>
      <article className="container mx-auto mt-8 mb-8 max-sm:p-9">
        <div className="overflow-x-auto">
          <DataState
            dataCount={cartProducts.length}
            loading={loading}
            noDataMessage="Os productos que adicionar no carrinho aparecerão aqui"
          >
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

            <div className="mt-10 mb-10 gap-y-5">
              <div className="text-black font-medium text-lg mb-8 flex flex-col gap-3">
                <span className="text-[#5e5f61] ">Total a pagar</span>
                <span className="font-bold text-4xl">
                  {money.format(totalPrice)}
                </span>
              </div>
              <Button
                style={{
                  padding: '13px 18px 13px 18px',
                  backgroundColor: '#00A4C7',
                }}
                onClick={() => {
                  if (initialized) {
                    if (user) {
                      setModalOpen(true)
                    } else {
                      setOpenLoginModal(true)
                    }
                  }
                }}
                disabled={selectedProducts.length === 0}
              >
                Enviar o pedido
              </Button>
            </div>
          </DataState>
        </div>
      </article>

      <Modal.Dialog
        title="Iniciar sessão"
        description="Você precisa estar com sessão iniciada para fazer um pedido?"
        actionTitle="Entrar"
        mainColor="#201D63"
        action={() => {
          router.push('/login')
        }}
        isOpen={openLoginModal}
        setOpen={setOpenLoginModal}
      />

      <Modal.Dialog
        title="Confirmar pedido"
        description="Você tem certeza que deseja realizar esse pedido? (accção irreversível)"
        actionTitle="Confirmar"
        mainColor="#201D63"
        action={createOrder}
        isOpen={confirmOrderModal}
        setOpen={setConfirmOrderModal}
      />

      <Modal.ConfirmOrder
        action={confirmOrder}
        isOpen={isModalOpened}
        setOpen={setModalOpen}
        productData={productData}
        selectedProducts={selectedProducts}
      />

      <Modal.OrderConfirmed
        orderData={orderConfirmedModal}
        setOrderData={setOrderConfirmedModal}
      />
    </section>
  )
}
