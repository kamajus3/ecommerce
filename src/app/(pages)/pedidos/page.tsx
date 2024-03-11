'use client'

import Header from '../../components/Header'
import { useEffect, useState } from 'react'
import { Order } from '@/@types'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { useAuth } from '@/hooks/useAuth'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { downloadInvoice, publishedSince } from '@/functions'
import DataState from '@/app/components/DataState'

function OrderTableRow(order: Order) {
  const money = useMoneyFormat()

  return (
    <tr className="border-y border-gray-200 border-y-[#dfdfdf]">
      <td className="p-3">
        <div className="text-center text-black font-medium">{order.id}</div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {order.products.length}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {order.address}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {order.state === 'not-sold' ? 'Em processamento' : 'Já pago'}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {publishedSince(order.createdAt)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
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
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              downloadInvoice(order.id)
            }}
            className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <span className="text-secondary font-medium">Baixar factura</span>
          </button>
        </div>
      </td>
    </tr>
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
  const { user } = useAuth()

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

          setOrderData(reverseData(results))
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
      privileges={['create-orders']}
    >
      <section className="bg-white min-h-screen overflow-hidden">
        <Header.Client />
        <article className="mb-2 mt-5">
          <p className="text-black font-semibold text-3xl p-9 max-sm:text-center">
            Os meus pedidos
          </p>
        </article>
        <article className="container mx-auto mt-8 mb-8 max-sm:p-9">
          <DataState
            dataCount={Object.entries(orderData).length}
            loading={loading}
            noDataMessage="Os pedidos que fizer aparecerão aqui"
          >
            <div className="overflow-x-auto">
              <table className="table-auto w-full border border-[#dddddd]">
                <thead>
                  <tr className="bg-[#F9FAFB] text-gray-600 uppercase text-sm">
                    <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                      Referência
                    </th>

                    <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                      Nº de entidades
                    </th>
                    <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                      Destinação
                    </th>
                    <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                      Estado
                    </th>
                    <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                      Data da realização
                    </th>
                    <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                      Valor a pagar
                    </th>
                    <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                      -
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {Object.entries(orderData).map(([id, order]) => (
                    <OrderTableRow key={id} {...order} id={id} />
                  ))}
                </tbody>
              </table>
            </div>
          </DataState>
        </article>
      </section>
    </ProtectedRoute>
  )
}
