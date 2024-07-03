'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  equalTo,
  onValue,
  orderByChild,
  orderByKey,
  query,
  ref,
  remove,
  update,
} from 'firebase/database'
import { Hash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Bounce, toast } from 'react-toastify'
import * as z from 'zod'

import { Order } from '@/@types'
import Button from '@/components/ui/Button'
import DataState from '@/components/ui/DataState'
import Header from '@/components/ui/Header'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import contants from '@/constants'
import { publishedSince } from '@/functions'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { database } from '@/lib/firebase/config'
import { zodResolver } from '@hookform/resolvers/zod'

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
    <Table.R inside="body">
      <Table.D>{order.id}</Table.D>
      <Table.D>{order.products.length}</Table.D>
      <Table.D>{`${order.firstName} ${order.lastName}`}</Table.D>
      <Table.D>{order.phone}</Table.D>
      <Table.D>{order.address}</Table.D>
      <Table.D>
        {order.state === 'not-sold' ? 'Não vendido' : 'Vendido'}
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
          Cancelar
        </Button>

        <Modal.Dialog
          title="Cancelar pedido"
          description="Você tem certeza que queres cancelar esse pedido?"
          actionTitle="Confirmar"
          themeColor={contants.colors.error}
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
          disabled
        >
          Vendido
        </Button>

        <Modal.Dialog
          title="Colocar como vendido"
          description="Você tem queres colocar o estado desse pedido para vendido?"
          actionTitle="Confirmar"
          action={putAsSold}
          isOpen={openSoldModal}
          setOpen={setOpenSoldModal}
        />
      </Table.D>

      <Table.D>
        <Link href={`/invoice/${order.id}`}>
          <Button variant="no-background" className="mx-auto text-main">
            Baixar
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

  const [orderData, setOrderData] = useState<Record<string, Order>>({})
  const [loading, setLoading] = useState(true)
  const code = watch('code')

  useEffect(() => {
    const fetchProducts = async () => {
      const reference = ref(database, 'orders/')
      const orderQuery = code
        ? query(reference, orderByKey(), equalTo(code))
        : query(reference, orderByChild('createdAt'))

      onValue(orderQuery, (snapshot) => {
        const results: Record<string, Order> = {}
        if (snapshot.exists()) {
          snapshot.forEach(function (child) {
            results[child.key] = child.val()
          })
        }

        setOrderData(reverseData(results))
        setLoading(false)
      })
    }

    fetchProducts()
  }, [setOrderData, code])

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
      <article className="mb-4 mt-5">
        <h1 className="text-black font-semibold text-3xl p-9">Pedidos</h1>

        <div className="px-8 gap-y-5 gap-x-4 flex flex-wrap items-center">
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

      <article className="px-8 mx-auto mb-8 max-sm:p-9">
        <DataState
          dataCount={Object.entries(orderData).length}
          loading={loading}
          noDataMessage={
            code
              ? 'Nenhum pedido com essa referência foi encontrado'
              : 'Os pedidos dos clientes aparecerão aqui'
          }
        >
          <Table.Root>
            <thead>
              <Table.R inside="head">
                <Table.H>Referência</Table.H>
                <Table.H>Entidades</Table.H>
                <Table.H>Nome</Table.H>
                <Table.H>Telefone</Table.H>
                <Table.H>Destinação</Table.H>
                <Table.H>Estado</Table.H>
                <Table.H>Data</Table.H>
                <Table.H>A pagar</Table.H>
                <Table.H>-</Table.H>
                <Table.H>-</Table.H>
                <Table.H>-</Table.H>
              </Table.R>
            </thead>
            <Table.Body>
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
            </Table.Body>
          </Table.Root>
        </DataState>
      </article>
    </section>
  )
}
