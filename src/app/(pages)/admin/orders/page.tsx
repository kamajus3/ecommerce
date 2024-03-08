'use client'

import Header from '@/app/components/Header'
import { useEffect, useState } from 'react'
import { Order } from '@/@types'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { onValue, orderByChild, query, ref } from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { useAuth } from '@/hooks/useAuth'
import { publishedSince } from '@/functions'
import DataState from '@/app/components/DataState'
import { SearchCode } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

interface FilterFormData {
  code: string
  orderBy: string
}

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
            onClick={() => {}}
            className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <span className="text-red-500 font-medium">Cancelar o pedido</span>
          </button>
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

const schema = z.object({
  code: z.string().trim(),
  orderBy: z.string().trim(),
})

export default function CartPage() {
  const { register, watch } = useForm<FilterFormData>({
    defaultValues: {
      orderBy: 'createdAt',
    },
    resolver: zodResolver(schema),
  })
  // const code = watch('search')
  const orderByValue = watch('orderBy')

  const [orderData, setOrderData] = useState<Record<string, Order>>({})
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        const reference = ref(database, 'orders/')
        const orderQuery = query(reference, orderByChild(orderByValue))

        onValue(orderQuery, (snapshot) => {
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

          setLoading(false)
        })
      }
    }

    fetchProducts()
  }, [user, orderByValue, setOrderData])

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Admin />
      <article className="mb-2 mt-5">
        <h1 className="text-black font-semibold text-3xl p-9 max-sm:text-center">
          Pedidos
        </h1>

        <div className="mb-10 px-8 gap-y-5 gap-x-4 flex flex-wrap items-center">
          <div className="max-sm:w-full rounded-lg bg-white p-3 px-4 border flex items-center gap-2">
            <SearchCode size={15} color="#6B7280" />
            <input
              type="text"
              placeholder="Referência"
              {...register('code')}
              className="max-sm:w-full text-gray-500 bg-white outline-none"
            />
          </div>

          <select
            {...register('orderBy')}
            className="max-sm:w-full rounded-lg bg-neutral-100 p-3 px-4 text-gray-500 bg-transparent outline-none border"
          >
            <option value="createdAt">Ordenar pela data de criação</option>
            <option value="name">Ordenar pelo número de entidades</option>
            <option value="name">Ordenar pelo valor pago</option>
          </select>
        </div>
      </article>
      <article className="container mx-auto mt-8 mb-8 max-sm:p-9">
        <DataState
          dataCount={Object.entries(orderData).length}
          loading={loading}
          noDataMessage="Os pedidos dos clientes aparecerão aqui"
        >
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-[#dddddd]">
              <thead>
                <tr className="bg-[#F9FAFB] text-gray-600 uppercase text-sm">
                  <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                    Referência
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Entidades
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
                    Data
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Valor a pagar
                  </th>
                  <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                    -
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
  )
}
