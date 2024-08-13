'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { IOrder } from '@/@types'
import Button from '@/components/ui/Button'
import DataState from '@/components/ui/DataState'
import Header from '@/components/ui/Header'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import Table from '@/components/ui/Table'
import { publishedSince } from '@/functions'
import { formatMoney } from '@/functions/format'
import { OrderRepository } from '@/repositories/order.repository'
import useUserStore from '@/store/UserStore'

function OrderTableRow(order: IOrder) {
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
      <Table.D>
        {order.state === 'not-sold' ? 'Em processamento' : 'Já pago'}
      </Table.D>
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
        <Link href={`/factura/${order.id}`}>
          <Button variant="no-background" className="mx-auto text-secondary">
            Baixar factura
          </Button>
        </Link>
      </Table.D>
    </Table.R>
  )
}

export default function CartPage() {
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
      pathWhenNotAuthorizated="/login"
      role="client"
    >
      <section className="bg-white min-h-screen overflow-hidden">
        <Header.Client />
        <article className="mb-2 mt-5">
          <h1 className="text-black font-semibold text-3xl p-9">
            Os meus pedidos
          </h1>
        </article>
        <article className="px-8 mx-auto mb-8 max-sm:p-9">
          <DataState
            dataCount={Object.entries(orderData).length}
            loading={loading}
            noDataMessage="Os pedidos que fizer aparecerão aqui"
          >
            <Table.Root>
              <thead>
                <Table.R inside="head">
                  <Table.H>Referência</Table.H>
                  <Table.H>Entidades</Table.H>
                  <Table.H>Destinação</Table.H>
                  <Table.H>Estado</Table.H>
                  <Table.H>Data da realização</Table.H>
                  <Table.H>Valor a pagar</Table.H>
                  <Table.H>-</Table.H>
                </Table.R>
              </thead>
              <Table.Body>
                {Object.entries(orderData).map(([id, order]) => (
                  <OrderTableRow key={id} {...order} id={id} />
                ))}
              </Table.Body>
            </Table.Root>
          </DataState>
        </article>
      </section>
    </ProtectedRoute>
  )
}
