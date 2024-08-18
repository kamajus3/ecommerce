'use client'

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'

import { IOrder, IProduct, IProductOrder } from '@/@types'
import Button from '@/components/ui/Button'
import DataState from '@/components/ui/DataState'
import Header from '@/components/ui/Header'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import constants from '@/constants'
import { calculateDiscountedPrice, campaignValidator } from '@/functions'
import { formatMoney, formatPhotoUrl } from '@/functions/format'
import { useAuth } from '@/hooks/useAuth'
import { Link, useRouter } from '@/navigation'
import { OrderRepository } from '@/repositories/order.repository'
import { ProductRepository } from '@/repositories/product.repository'
import sendOrder from '@/services/email/send'
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

  const notifyDelete = () => toast.success('Product removed successfully')

  return (
    <Table.R inside="body">
      <Table.D>
        <input
          type="checkbox"
          checked={selectedProducts.includes(product.id)}
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
          href={`/product/${product.id}`}
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
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </Table.D>
      <Table.D>x{product.quantity}</Table.D>
      <Table.D>{formatMoney(product.price)}</Table.D>
      <Table.D>
        {product.campaign &&
        campaignValidator(product.campaign) === 'promotional-campaign'
          ? `${product.campaign.reduction} %`
          : '-'}
      </Table.D>
      <Table.D>
        {formatMoney(
          calculateDiscountedPrice(
            product.price,
            product.quantity,
            product.campaign?.reduction,
          ),
        )}
      </Table.D>
      <Table.D>
        <Button
          variant="no-background"
          className="mx-auto text-red-500"
          onClick={() => setOpenDeleteModal(true)}
        >
          Remove
        </Button>
        <Modal.Dialog
          title="Remove Product"
          description="Are you sure you want to remove this product from the cart?"
          actionTitle="Remove"
          themeColor={constants.colors.error}
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

  const [orderData, setOrderData] =
    useState<Omit<IOrder, 'id' | 'createdAt' | 'updatedAt'>>()
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { initialized } = useAuth()

  const userData = useUserStore((state) => state.data)
  const userMetadata = useUserStore((state) => state.metadata)

  const ICartProducts = useCartStore((state) => state.products)
  const [selectedProducts, setSelectedProduct] = useState<string[]>([])

  const productRepository = useMemo(() => new ProductRepository(), [])
  const orderRepository = useMemo(() => new OrderRepository(), [])

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts: ICartProduct[] = []

      if (ICartProducts.length > 0) {
        for (const p of ICartProducts) {
          await productRepository.findById(p.id).then((product) => {
            if (product) {
              fetchedProducts.push({
                ...product,
                id: p.id,
                quantity: p.quantity,
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
  }, [ICartProducts, productRepository])

  useEffect(() => {
    const selectedTotalPrice = productData.reduce((total, product) => {
      if (product && selectedProducts.includes(product.id)) {
        return (
          total +
          calculateDiscountedPrice(
            product.price,
            product.quantity,
            product.campaign?.reduction,
          )
        )
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
    if (userMetadata && orderData) {
      try {
        const data = await orderRepository.create(orderData)
        if (userMetadata.email) {
          sendOrder({
            ...data,
            email: userMetadata.email,
            totalPrice,
          })
        }

        selectedProducts.forEach((id) => removeFromCart(id))
        setSelectedProduct([])
        setOrderConfirmedModal([true, data.id])
      } catch {
        toast.error('Error processing your order')
      }
    }
  }

  async function confirmOrder(data: IFormData) {
    const productsList: IProductOrder[] = []

    for (const id of selectedProducts) {
      const product = await productRepository.findById(id)
      const cartProduct = ICartProducts.find((p) => p.id === id)

      if (product && cartProduct) {
        productsList.push({
          id,
          name: product.name,
          quantity: cartProduct.quantity,
          price: product.price,
          promotion: product.campaign?.reduction
            ? Number(product.campaign?.reduction)
            : undefined,
        })
      }
    }

    if (userMetadata && productsList.length > 0) {
      setOrderData({
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phone: data.phone,
        userId: userMetadata.uid,
        state: 'not-sold',
        products: productsList,
      })
      setConfirmOrderModal(true)
    } else {
      toast.error('Error processing your order')
    }
  }

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Client />
      <article className="mb-2 mt-5">
        <h1 className="text-black font-semibold text-3xl p-9">Shopping Cart</h1>
      </article>
      <article className="px-8 mx-auto mb-8 max-sm:p-9">
        <div className="overflow-x-auto">
          <DataState
            dataCount={ICartProducts.length}
            loading={loading}
            noDataMessage="Products added to the cart will appear here"
          >
            <Table.Root>
              <thead>
                <Table.R inside="head">
                  <Table.H>
                    <input
                      type="checkbox"
                      id="select-all-products"
                      name="select-all-products"
                      checked={selectedProducts.length === ICartProducts.length}
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
                  <Table.H>Photo</Table.H>
                  <Table.H>Name</Table.H>
                  <Table.H>Quantity</Table.H>
                  <Table.H>Unit Price</Table.H>
                  <Table.H>Discount</Table.H>
                  <Table.H>Total Price</Table.H>
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
                <span className="text-gray-500">Total to Pay</span>
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
                    if (userData?.role === 'client') {
                      setModalOpen(true)
                    } else {
                      setOpenLoginModal(true)
                    }
                  }
                }}
                disabled={selectedProducts.length === 0}
              >
                Place Order
              </Button>
            </div>
          </DataState>
        </div>
      </article>

      <Modal.Dialog
        title="Log In"
        description="You need to be logged in to place an order."
        actionTitle="Log In"
        action={() => {
          router.push('/login')
        }}
        isOpen={openLoginModal}
        setOpen={setOpenLoginModal}
      />

      <Modal.Dialog
        title="Confirm Order"
        description="Are you sure you want to place this order? (irreversible action)"
        actionTitle="Confirm"
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
