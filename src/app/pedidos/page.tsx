'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database'

import { Order } from '@/@types'
import Button from '@/components/ui/Button'
import DataState from '@/components/ui/DataState'
import Header from '@/components/ui/Header'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import Table from '@/components/ui/Table'
import { publishedSince } from '@/functions'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { database } from '@/lib/firebase/config'
import useUserStore from '@/store/UserStore'

function OrderTableRow(order: Order) {
  const money = useMoneyFormat()

  return (
    <Table.R inside="body">
      <Table.D>{order.id}</Table.D>
      <Table.D>{order.products.length}</Table.D>
      <Table.D>{order.address}</Table.D>
      <Table.D>
        {order.state === 'not-sold' ? 'Em processamento' : 'Já pago'}
      </Table.D>
      <Table.D>{publishedSince(order.createdAt)}</Table.D>
      <Table.D>
        {money.format(
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
            Baixar factura
          </Button>
        </Link>
      </Table.D>
    </Table.R>
  )
}

function reverseData(obj: Record<string, Order>) {
  const newObj: Record<string, Order> = {}
  const revObj = Object.keys(obj).reverse()
  revObj.forEach(function (i) {
    newObj[i] = obj[i]
  })
  return newObj
}

export default function CartPage() {
  const [orderData, setOrderData] = useState<Record<string, Order>>({})
  const [loading, setLoading] = useState(true)
  const user = useUserStore((state) => state.metadata)

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        const reference = ref(database, 'orders/')
        const orderQuery = query(
          reference,
          orderByChild('userId'),
          equalTo(user.uid),
        )

        onValue(orderQuery, (snapshot) => {
          const results: Record<string, Order> = {}
          snapshot.forEach(function (child) {
            results[child.key] = child.val()
          })

          const sortedArray = Object.entries(results).sort(
            ([, valueA], [, valueB]) => {
              const dateA = new Date(valueA.createdAt)
              const dateB = new Date(valueB.createdAt)
              return dateA.getTime() - dateB.getTime()
            },
          )

          const recordFormat: Record<string, Order> = sortedArray.reduce(
            (acc: Record<string, Order>, [key, value]) => {
              acc[key] = value
              return acc
            },
            {},
          )

          setOrderData(reverseData(recordFormat))
          setLoading(false)
        })
      }
    }

    fetchProducts()
  }, [user])

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
