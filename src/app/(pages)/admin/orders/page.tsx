'use client'

import Header from '@/app/components/Header'
import { useEffect, useState } from 'react'
import { Order } from '@/@types'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import {
  Query,
  equalTo,
  onValue,
  orderByChild,
  orderByKey,
  query,
  ref,
  remove,
  update,
} from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { useAuth } from '@/hooks/useAuth'
import { downloadInvoice, publishedSince } from '@/functions'
import DataState from '@/app/components/DataState'
import { Hash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Modal from '@/app/components/Modal'
import { Bounce, toast } from 'react-toastify'
import clsx from 'clsx'

interface FilterFormData {
  code: string
  orderBy: string
}

interface OrderTableRowProps {
  order: Order
  deleteOrder(): void
  putAsSold(): void
}

function OrderTableRow({ order, deleteOrder, putAsSold }: OrderTableRowProps) {
  const money = useMoneyFormat()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openSoldModal, setOpenSoldModal] = useState(false)

  return (
    <>
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
            {order.state === 'not-sold' ? 'Não vendido' : 'Vendido'}
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
                    total +
                    (product.price * product.quantity - product.promotion)
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
                if (order.state === 'not-sold') {
                  setOpenDeleteModal(true)
                }
              }}
              disabled={order.state === 'sold'}
              className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:cursor-not-allowed"
            >
              <span
                className={clsx('text-[#adadad]  font-medium', {
                  'text-red-500': order.state !== 'sold',
                })}
              >
                Cancelar
              </span>
            </button>
          </div>
        </td>
        <td className="p-3">
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                if (order.state === 'not-sold') {
                  setOpenSoldModal(true)
                }
              }}
              disabled={order.state === 'sold'}
              className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:cursor-not-allowed"
            >
              <span
                className={clsx('text-[#00A4C7] font-medium', {
                  'text-[#adadad]': order.state === 'sold',
                })}
              >
                Vendido
              </span>
            </button>
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
              <span className="text-main font-medium">Baixar</span>
            </button>
          </div>
        </td>
      </tr>
      <Modal.Dialog
        title={`Cancelar pedido`}
        description="Você tem certeza que queres cancelar esse pedido?"
        actionTitle="Confirmar"
        mainColor="#dc2626"
        action={deleteOrder}
        isOpen={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />

      <Modal.Dialog
        title="Colocar como vendido"
        description="Você tem queres colocar o estado desse pedido para vendido?"
        actionTitle="Confirmar"
        mainColor="#201D63"
        action={putAsSold}
        isOpen={openSoldModal}
        setOpen={setOpenSoldModal}
      />
    </>
  )
}

const schema = z.object({
  code: z.string().trim(),
  orderBy: z.string().trim(),
})

function reverseData(obj: Record<string, Order>) {
  const newObj: Record<string, Order> = {}
  const revObj = Object.keys(obj).reverse()
  revObj.forEach(function (i) {
    newObj[i] = obj[i]
  })
  return newObj
}

export default function CartPage() {
  const { register, watch } = useForm<FilterFormData>({
    defaultValues: {
      orderBy: 'createdAt',
    },
    resolver: zodResolver(schema),
  })
  const code = watch('code')

  const [orderData, setOrderData] = useState<Record<string, Order>>({})
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        const reference = ref(database, 'orders/')
        let orderQuery: Query
        if (code) {
          orderQuery = query(reference, orderByKey(), equalTo(code))
        } else {
          orderQuery = query(reference, orderByChild('createdAt'))
        }

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
  }, [user, setOrderData, code])

  async function updateOrderState(orderId: string, state: string) {
    try {
      update(ref(database, `orders/${orderId}`), {
        updatedAt: new Date().toISOString(),
        state,
      })
      toast.success('O estado do pedido foi alterado com sucesso', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    } catch {
      toast.error('Erro ao alterar o estado do pedido', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    }
  }

  async function deleteOrder(orderId: string) {
    try {
      const databaseReference = ref(database, `orders/${orderId}`)
      await remove(databaseReference)
      toast.success('Pedido cancelado com sucesso', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    } catch {
      toast.error('Erro a apagar o pedido', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    }
  }

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Admin />
      <article className="mb-2 mt-5">
        <h1 className="text-black font-semibold text-3xl p-9 max-sm:text-center">
          Pedidos
        </h1>

        <div className="mb-10 px-8 gap-y-5 gap-x-4 flex flex-wrap items-center">
          <div className="max-sm:w-full rounded-lg bg-white p-3 px-4 border flex items-center gap-2">
            <Hash size={15} color="#6B7280" />
            <input
              type="text"
              placeholder="Referência"
              {...register('code')}
              className="max-sm:w-full text-gray-500 bg-white outline-none"
            />
          </div>
        </div>
      </article>
      <article className="container mx-auto mt-8 mb-8 max-sm:p-9">
        <DataState
          dataCount={Object.entries(orderData).length}
          loading={loading}
          noDataMessage={
            code
              ? 'Nenhum pedido com essa referência foi encontrado'
              : 'Os pedidos dos clientes aparecerão aqui'
          }
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
                    Estado
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Data
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    A pagar
                  </th>
                  <th className="p-3 capitalize font-semibold text-base text-[#111827]">
                    -
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
                  <OrderTableRow
                    key={id}
                    order={{
                      ...order,
                      id,
                    }}
                    deleteOrder={() => deleteOrder(id)}
                    putAsSold={() => updateOrderState(id, 'sold')}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </DataState>
      </article>
    </section>
  )
}
