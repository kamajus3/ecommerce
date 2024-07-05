'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ref, set } from 'firebase/database'
import { nanoid } from 'nanoid'
import { Bounce, toast } from 'react-toastify'

import { IOrder, IProduct, IProductOrder } from '@/@types'
import Button from '@/components/ui/Button'
import DataState from '@/components/ui/DataState'
import Header from '@/components/ui/Header'
import Modal from '@/components/ui/Modal'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import Table from '@/components/ui/Table'
import contants from '@/constants'
import { campaignValidator, formatMoney, formatPhotoUrl } from '@/functions'
import { useAuth } from '@/hooks/useAuth'
import sendOrder from '@/services/email/send'
import { database } from '@/services/firebase/config'
import { getProduct } from '@/services/firebase/database'
import useCartStore from '@/store/CartStore'
import useUserStore from '@/store/UserStore'

interface ICartProduct extends IProduct {
  quantity: number
}

interface ITableRow {
  product: ICartProduct
  selectedProducts: string[]
  setSelectedProduct: Dispatch<SetStateAction<string[]>>
}

function TableRow({
  product,
  selectedProducts,
  setSelectedProduct,
}: ITableRow) {
  const removeFromCart = useCartStore((state) => state.removeProduct)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

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
    <Table.R inside="body">
      <Table.D>
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
        />
      </Table.D>
      <Table.D>
        <Link
          href={`/producto/${product.id}`}
          className="flex items-center justify-center"
        >
          <Image
            width={70}
            height={70}
            src={formatPhotoUrl(product.photo, product.updatedAt)}
            alt={product.name}
            draggable={false}
            className="select-none"
          />
        </Link>
      </Table.D>
      <Table.D>
        <Link href={`/producto/${product.id}`}>{product.name}</Link>
      </Table.D>
      <Table.D>{formatMoney(product.price)}</Table.D>
      <Table.D>x{product.quantity}</Table.D>
      <Table.D>
        {product.campaign &&
        campaignValidator(product.campaign) === 'campaign-with-promotion'
          ? `${product.campaign?.reduction} %`
          : '-'}
      </Table.D>
      <Table.D>
        <Button
          variant="no-background"
          className="mx-auto text-red-500"
          onClick={() => setOpenDeleteModal(true)}
        >
          Remover
        </Button>
        <Modal.Dialog
          title="Remover producto"
          description="Você tem certeza que queres remover esse producto do carinho?"
          actionTitle="Remover"
          themeColor={contants.colors.error}
          action={() => {
            removeFromCart(product.id)
            notifyDelete()
          }}
          isOpen={openDeleteModal}
          setOpen={setOpenDeleteModal}
        />
      </Table.D>
    </Table.R>
  )
}

export default function CartPage() {
  const removeFromCart = useCartStore((state) => state.removeProduct)
  const [totalPrice, setTotalPrice] = useState(0)
  const [productData, setProductData] = useState<ICartProduct[]>([])

  const [isModalOpened, setModalOpen] = useState(false)
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [confirmOrderModal, setConfirmOrderModal] = useState(false)
  const [orderConfirmedModal, setOrderConfirmedModal] = useState<
    [boolean, string | undefined]
  >([false, undefined])

  const [orderData, setOrderData] = useState<IOrder>()
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { initialized } = useAuth()
  const user = useUserStore((state) => state.metadata)

  const ICartProducts = useCartStore((state) => state.products)
  const [selectedProducts, setSelectedProduct] = useState<string[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts: ICartProduct[] = []

      if (ICartProducts.length > 0) {
        for (const p of ICartProducts) {
          await getProduct(p.id).then((product) => {
            if (product) {
              const productPrice =
                product.campaign?.reduction &&
                Number(product.campaign?.reduction) !== 0
                  ? product.price -
                    product.price * (Number(product.campaign.reduction) / 100)
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
  }, [ICartProducts])

  useEffect(() => {
    const selectedTotalPrice = productData.reduce((total, product) => {
      if (product && selectedProducts.includes(product.id)) {
        return total + product.price * product.quantity
      }
      return total
    }, 0)

    setTotalPrice(selectedTotalPrice)
  }, [selectedProducts, ICartProducts, productData])

  interface IFormData {
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
          if (orderData && user.email) {
            sendOrder({
              ...orderData,
              id: orderId,
              email: user.email,
              totalPrice,
            })
          }
          selectedProducts.map((id) => removeFromCart(id))
          setSelectedProduct([])
          setOrderConfirmedModal([true, orderId])
        })
        .catch(() => {
          toast.error('Erro ao tentar fazer o teu pedido', {
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

  async function confirmOrder(data: IFormData) {
    const productsList: IProductOrder[] = []

    for (const id of selectedProducts) {
      const product = await getProduct(id)
      const ICartProduct = ICartProducts.find((p) => p.id === id)

      if (product && ICartProduct) {
        productsList.push({
          id,
          name: product.name,
          quantity: ICartProduct.quantity,
          price: product.price,
          promotion: product.campaign?.reduction
            ? Number(product.campaign?.reduction)
            : null,
        })
      }
    }

    if (user && productsList.length > 0) {
      setOrderData({
        id: '',
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
      toast.error('Erro ao tentar fazer o teu pedido', {
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
    <ProtectedRoute
      pathWhenAuthorizated="/"
      pathWhenNotAuthorizated="/login"
      role="client"
    >
      <section className="bg-white min-h-screen overflow-hidden">
        <Header.Client />
        <article className="mb-2 mt-5">
          <h1 className="text-black font-semibold text-3xl p-9">
            Carrinho de productos
          </h1>
        </article>
        <article className="px-8 mx-auto mb-8 max-sm:p-9">
          <div className="overflow-x-auto">
            <DataState
              dataCount={ICartProducts.length}
              loading={loading}
              noDataMessage="Os productos que adicionar no carrinho aparecerão aqui"
            >
              <Table.Root>
                <thead>
                  <Table.R inside="head">
                    <Table.H>
                      <input
                        type="checkbox"
                        id="select-all-products"
                        name="select-all-products"
                        checked={
                          selectedProducts.length === ICartProducts.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProduct(ICartProducts.map((p) => p.id))
                          } else {
                            setSelectedProduct([])
                          }
                        }}
                        className="w-4 h-4 border-gray-300 rounded bg-gray-700 cursor-pointer"
                      />
                    </Table.H>
                    <Table.H>Foto</Table.H>
                    <Table.H>Nome</Table.H>
                    <Table.H>Preço</Table.H>
                    <Table.H>Quantidade</Table.H>
                    <Table.H>Promoção</Table.H>
                    <Table.H>-</Table.H>
                  </Table.R>
                </thead>
                <Table.Body>
                  {productData.map((product) => (
                    <TableRow
                      key={product.id}
                      product={product}
                      setSelectedProduct={setSelectedProduct}
                      selectedProducts={selectedProducts}
                    />
                  ))}
                </Table.Body>
              </Table.Root>

              <div className="mt-10 mb-10 gap-y-5">
                <div className="text-black font-medium text-lg mb-8 flex flex-col gap-3">
                  <span className="text-gray-500">Total a pagar</span>
                  <span className="font-bold text-4xl">
                    {formatMoney(totalPrice)}
                  </span>
                </div>
                <Button
                  style={{
                    padding: '13px 18px 13px 18px',
                  }}
                  className="bg-secondary"
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
    </ProtectedRoute>
  )
}
