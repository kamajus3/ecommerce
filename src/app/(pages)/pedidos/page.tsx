'use client'

import Header from '../../components/Header'
import { useEffect, useState } from 'react'
import { Order } from '@/@types'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { onValue, ref } from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { useAuth } from '@/hooks/useAuth'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { publishedSince } from '@/functions'

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
          {publishedSince(order.createdAt)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {money.format(
            order.products.reduce((total, product) => {
              if (product.promotion) {
                return total + (product.price - product.promotion)
              } else {
                return total + product.price
              }
            }, 0),
          )}
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center">
          <button
            onClick={() => {}}
            className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <span className="text-red-500 font-medium">Baixar factura</span>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function CartPage() {
  const [orderData, setOrderData] = useState<Order[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        const reference = ref(database, `orders/${user.uid}`)
        onValue(reference, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            setOrderData(data)
          }
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
                    Data do pedido
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
        </article>
      </section>
    </ProtectedRoute>
  )
}
