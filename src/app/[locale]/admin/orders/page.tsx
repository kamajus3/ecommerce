'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Hash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { IOrder, IProduct } from '@/@types'
import Button from '@/components/Button'
import DataState from '@/components/DataState'
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import Table from '@/components/Table'
import constants from '@/constants'
import { publishedSince } from '@/functions'
import { formatMoney, formatPhoneNumber } from '@/functions/format'
import { Link } from '@/navigation'
import { OrderRepository } from '@/repositories/order.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { zodResolver } from '@hookform/resolvers/zod'

interface IFilterData {
  code: string
  orderBy: string
}

interface ITableRow {
  order: IOrder
  deleteOrder(): void
  putAsSold(): void
}

function TableRow({ order, deleteOrder, putAsSold }: ITableRow) {
  const t = useTranslations()

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openSoldModal, setOpenSoldModal] = useState(false)

  const abbrTitle =
    `${order.products.map((p) => `- ${p.name} (x${p.quantity})\n`)}`.replaceAll(
      ',',
      '',
    )

  return (
    <Table.R inside="body">
      <Table.D>{order.id}</Table.D>
      <Table.D>
        <abbr title={abbrTitle} className="w-full border-none cursor-default">
          {order.products.length}
        </abbr>
      </Table.D>
      <Table.D>{`${order.firstName} ${order.lastName}`}</Table.D>
      <Table.D>
        {formatPhoneNumber(`+${order.phone.ddd}${order.phone.number}`)}
      </Table.D>
      <Table.D>{order.address}</Table.D>
      <Table.D>{t(`admin.order.table.content.states.${order.state}`)}</Table.D>
      <Table.D>{publishedSince(order.createdAt)}</Table.D>
      <Table.D>
        {formatMoney(
          order.products.reduce((total, product) => {
            if (product.promotion) {
              return (
                total + (product.price * product.quantity - product.promotion)
              )
            } else {
              return total + product.price * product.quantity
            }
          }, 0),
        )}
      </Table.D>
      <Table.D>
        <Button
          variant="no-background"
          className="mx-auto text-red-500"
          onClick={() => {
            if (order.state === 'not-sold') {
              setOpenDeleteModal(true)
            }
          }}
          disabled={order.state === 'sold'}
        >
          {t('admin.order.table.content.cancel.button')}
        </Button>
        <Modal.Dialog
          title={t('admin.order.table.content.cancel.title')}
          description={t('admin.order.table.content.cancel.description')}
          actionTitle={t('admin.order.table.content.cancel.action')}
          themeColor={constants.colors.error}
          action={deleteOrder}
          isOpen={openDeleteModal}
          setOpen={setOpenDeleteModal}
        />
      </Table.D>
      <Table.D>
        <Button
          variant="no-background"
          className="mx-auto text-secondary"
          onClick={() => {
            if (order.state === 'not-sold') {
              setOpenSoldModal(true)
            }
          }}
          disabled={order.state === 'sold'}
        >
          {t('admin.order.table.content.sell.button')}
        </Button>
        <Modal.Dialog
          title={t('admin.order.table.content.sell.title')}
          description={t('admin.order.table.content.sell.description')}
          actionTitle={t('admin.order.table.content.sell.action')}
          action={putAsSold}
          isOpen={openSoldModal}
          setOpen={setOpenSoldModal}
        />
      </Table.D>
      <Table.D>
        <Link href={`/invoice/${order.id}`}>
          <Button variant="no-background" className="mx-auto text-primary">
            {t('admin.order.table.content.viewInvoice.button')}
          </Button>
        </Link>
      </Table.D>
    </Table.R>
  )
}

const schema = z.object({
  code: z.string().trim(),
  orderBy: z.string().trim(),
})

export default function OrderPage() {
  const { register, watch } = useForm<IFilterData>({
    defaultValues: {
      orderBy: 'createdAt',
    },
    resolver: zodResolver(schema),
  })

  const [orderData, setOrderData] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const code = watch('code')

  const productRepository = useMemo(() => new ProductRepository(), [])
  const orderRepository = useMemo(() => new OrderRepository(), [])

  const t = useTranslations('admin.order')

  useEffect(() => {
    const fetchProducts = async () => {
      let orders: Promise<IOrder[]>

      if (code) {
        orders = orderRepository.find({
          filterById: code,
        })
      } else {
        orders = orderRepository.find({
          orderBy: 'createdAt',
        })
      }

      return orders
    }

    fetchProducts()
      .then((data) => {
        setOrderData(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [setOrderData, code, orderRepository])

  async function updateOrderState(order: IOrder, state: 'sold' | 'not-sold') {
    let errorMessage = 'Erro ao alterar o estado do pedido'
    const soldProducts: IProduct[] = []

    try {
      if (state === 'sold') {
        for (const p of order.products) {
          const product = await productRepository.findById(p.id)

          if (product) {
            soldProducts.push({
              ...product,
              id: p.id,
            })

            if (product.quantity === 0) {
              errorMessage = `O/A ${product.name} está fora de estoque`
              throw new Error(errorMessage)
            }

            if (p.quantity > product.quantity) {
              errorMessage = `Tem apenas ${product.quantity} ${product.name} em estoque`
              throw new Error(errorMessage)
            }

            if (p.quantity > product.quantity) {
              errorMessage = `Não tem nenhum ${product.name} em estoque`
              throw new Error(errorMessage)
            }
          } else {
            errorMessage = `O producto ${p.name} não está no estoque`
            throw new Error(errorMessage)
          }
        }
      }

      await orderRepository.update(
        {
          state,
        },
        order.id,
      )

      for (const p of soldProducts) {
        const orderProduct = order.products.find((op) => op.id === p.id)

        if (orderProduct) {
          await productRepository.update(
            {
              quantity: p.quantity - orderProduct.quantity,
            },
            p.id,
          )
        }
      }

      toast.success(t('stateUpdated'))
    } catch {
      toast.error(errorMessage)
    }
  }

  async function deleteOrder(orderId: string) {
    try {
      await orderRepository.deleteById(orderId)
      toast.success(t('table.content.cancel.successful'))
    } catch {
      toast.error(t('table.content.cancel.error'))
    }
  }

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Admin />
      <article className="mb-4 mt-5">
        <h1 className="text-black font-semibold text-3xl p-9">{t('title')}</h1>

        <div className="px-8 gap-y-5 gap-x-4 flex flex-wrap items-center">
          <div className="max-sm:w-full rounded-lg bg-white p-3 px-4 border flex items-center gap-2">
            <Hash size={15} color="#6B7280" />
            <input
              type="text"
              placeholder={t('table.header.reference')}
              {...register('code')}
              className="max-sm:w-full text-gray-500 bg-white outline-none"
            />
          </div>
        </div>
      </article>

      <article className="px-8 mx-auto mb-8 max-sm:p-9">
        <DataState
          dataCount={orderData.length}
          loading={loading}
          noDataMessage={code ? t('notFound') : t('noDataMessage')}
        >
          <Table.Root>
            <thead>
              <Table.R inside="head">
                <Table.H>{t('table.header.reference')}</Table.H>
                <Table.H>{t('table.header.entities')}</Table.H>
                <Table.H>{t('table.header.name')}</Table.H>
                <Table.H>{t('table.header.phone')}</Table.H>
                <Table.H>{t('table.header.reference')}</Table.H>
                <Table.H>{t('table.header.state')}</Table.H>
                <Table.H>{t('table.header.date')}</Table.H>
                <Table.H>{t('table.header.toPay')}</Table.H>
                <Table.H>-</Table.H>
                <Table.H>-</Table.H>
                <Table.H>-</Table.H>
              </Table.R>
            </thead>
            <Table.Body>
              {orderData.map((order) => (
                <TableRow
                  key={order.id}
                  order={order}
                  deleteOrder={() => deleteOrder(order.id)}
                  putAsSold={() => updateOrderState(order, 'sold')}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </DataState>
      </article>
    </section>
  )
}
