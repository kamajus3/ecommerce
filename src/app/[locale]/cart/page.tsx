'use client'

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { nanoid } from 'nanoid'
import { toast } from 'react-toastify'

import { IOrder, IPhone, IProduct, IProductOrder } from '@/@types'
import Button from '@/components/Button'
import DataState from '@/components/DataState'
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import Table from '@/components/Table'
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
  const t = useTranslations('cart')

  const removeFromCart = useCartStore((state) => state.removeProduct)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

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
          {t('table.content.remove.action')}
        </Button>
        <Modal.Dialog
          title={t('table.content.remove.title')}
          description={t('table.content.remove.description')}
          actionTitle={t('table.content.remove.action')}
          themeColor={constants.colors.error}
          action={() => {
            removeFromCart(product.id)
            toast.success(t('table.content.remove.successful'))
          }}
          isOpen={openDeleteModal}
          setOpen={setOpenDeleteModal}
        />
      </Table.D>
    </Table.R>
  )
}

export default function CartPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = useTranslations('cart')

  const removeFromCart = useCartStore((state) => state.removeProduct)
  const [totalPrice, setTotalPrice] = useState(0)
  const [productData, setProductData] = useState<ICartProduct[]>([])

  const [isModalOpened, setModalOpen] = useState(false)
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [confirmOrderModal, setOrderModal] = useState(false)
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
    phone: IPhone
  }

  async function createOrder() {
    if (userMetadata && orderData) {
      try {
        const data = await orderRepository.create(orderData, nanoid(10))
        if (userMetadata.email) {
          sendOrder({
            order: {
              ...data,
              email: userMetadata.email,
              totalPrice,
            },
            locale,
          })
        }

        selectedProducts.forEach((id) => removeFromCart(id))
        setSelectedProduct([])
        setOrderConfirmedModal([true, data.id])
      } catch {
        toast.error(t('error'))
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
      setOrderModal(true)
    } else {
      toast.error(t('error'))
    }
  }

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Client />
      <article className="mb-2 mt-5">
        <h1 className="text-black font-semibold text-3xl p-9">{t('title')}</h1>
      </article>
      <article className="px-8 mx-auto mb-8 max-sm:p-9">
        <div className="overflow-x-auto">
          <DataState
            dataCount={ICartProducts.length}
            loading={loading}
            noDataMessage={t('noDataMessage')}
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
                  <Table.H>{t('table.header.photo')}</Table.H>
                  <Table.H>{t('table.header.product')}</Table.H>
                  <Table.H>{t('table.header.quantity')}</Table.H>
                  <Table.H>{t('table.header.unitPrice')}</Table.H>
                  <Table.H>{t('table.header.discount')}</Table.H>
                  <Table.H>{t('table.header.totalPrice')}</Table.H>
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
                <span className="text-gray-500">
                  {t('table.header.totalAmountDue')}
                </span>
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
                {t('action')}
              </Button>
            </div>
          </DataState>
        </div>
      </article>

      <Modal.Dialog
        title={t('modals.login.title')}
        description={t('modals.login.description')}
        actionTitle={t('modals.login.title')}
        action={() => {
          router.push('/login?onsuccessful=/cart')
        }}
        isOpen={openLoginModal}
        setOpen={setOpenLoginModal}
      />

      <Modal.Dialog
        title={t('modals.order.title')}
        description={t('modals.order.description')}
        actionTitle={t('modals.order.title')}
        action={createOrder}
        isOpen={confirmOrderModal}
        setOpen={setOrderModal}
      />

      <Modal.Order
        title={t('modals.order.title')}
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
