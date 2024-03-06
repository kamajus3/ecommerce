'use client'

import Header from '@/app/components/Header'
import { useEffect, useState } from 'react'
import { Order } from '@/@types'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { onValue, ref } from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { useAuth } from '@/hooks/useAuth'

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
          {`${order.firstName} ${order.lastName}`}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {order.phone}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {order.address}
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
  const [orderData, setOrderData] = useState<Record<string, Order>>({})
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        const reference = ref(database, 'orders/')
        onValue(reference, (snapshot) => {
          const newOrders = {}
          snapshot.forEach(function (childSnapshot) {
            const userOrders = childSnapshot.val()

            if (userOrders) {
              Object.assign(newOrders, userOrders)
            }
          })

          setOrderData((prevOrders) => ({
            ...prevOrders,
            ...newOrders,
          }))
        })
      }
    }

    fetchProducts()
  }, [user, setOrderData])

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Admin />
      <article className="mb-2 mt-5">
        <p className="text-black font-semibold text-3xl p-9 max-sm:text-center">
          Pedidos
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
                <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                  Nome
                </th>
                <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                  Telefone
                </th>
                <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                  Destinação
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
  )
}
