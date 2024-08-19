'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { IOrder } from '@/@types'
import Button from '@/components/Button'
import DataState from '@/components/DataState'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import Table from '@/components/Table'
import { publishedSince } from '@/functions'
import { formatMoney } from '@/functions/format'
import { Link } from '@/navigation'
import { OrderRepository } from '@/repositories/order.repository'
import useUserStore from '@/store/UserStore'

function OrderTableRow(order: IOrder) {
  const t = useTranslations('admin.order')

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
      <Table.D>{order.address}</Table.D>
      <Table.D>{t(`table.content.states.${order.state}`)}</Table.D>
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
        <Link href={`/invoice/${order.id}`}>
          <Button variant="no-background" className="mx-auto text-secondary">
            {t('table.content.viewInvoice.button')}
          </Button>
        </Link>
      </Table.D>
    </Table.R>
  )
}

export default function OrderPage() {
  const t = useTranslations()

  const [orderData, setOrderData] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const user = useUserStore((state) => state.metadata)

  const orderRepository = useMemo(() => new OrderRepository(), [])

  const getOrders = useCallback(async () => {
    if (user) {
      const products = await orderRepository.find({
        orderBy: 'updatedAt',
        filterBy: {
          userId: user.uid,
        },
      })

      setOrderData(products)
    }
  }, [orderRepository, user])

  useEffect(() => {
    ;(async function () {
      await getOrders().finally(() => {
        setLoading(false)
      })
    })()
  }, [getOrders])

  return (
    <ProtectedRoute
      pathWhenAuthorizated="/"
      pathWhenNotAuthorizated={`/login`}
      role="client"
    >
      <section className="bg-white min-h-screen overflow-hidden">
        <Header.Client />
        <article className="mb-2 mt-5">
          <h1 className="text-black font-semibold text-3xl p-9">
            {t('order.title')}
          </h1>
        </article>
        <article className="px-8 mx-auto mb-8 max-sm:p-9">
          <DataState
            dataCount={orderData.length}
            loading={loading}
            noDataMessage={t('order.noDataMessage')}
          >
            <Table.Root>
              <thead>
                <Table.R inside="head">
                  <Table.H>{t('admin.order.table.header.reference')}</Table.H>
                  <Table.H>{t('admin.order.table.header.entities')}</Table.H>
                  <Table.H>{t('admin.order.table.header.entities')}</Table.H>
                  <Table.H>{t('admin.order.table.header.state')}</Table.H>
                  <Table.H>{t('admin.order.table.header.date')}</Table.H>
                  <Table.H>{t('admin.order.table.header.toPay')}</Table.H>
                  <Table.H>-</Table.H>
                </Table.R>
              </thead>
              <Table.Body>
                {orderData.map((order) => (
                  <OrderTableRow key={order.id} {...order} />
                ))}
              </Table.Body>
            </Table.Root>
          </DataState>
        </article>
      </section>
    </ProtectedRoute>
  )
}
