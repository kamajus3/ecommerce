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

import { IOrder, IProduct } from '@/@types'
import Button from '@/components/ui/Button'
import DataState from '@/components/ui/DataState'
import Header from '@/components/ui/Header'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import contants from '@/constants'
import { formatPhoneNumber, publishedSince } from '@/functions'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { database } from '@/services/firebase/config'
import { getProduct } from '@/services/firebase/database'
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
  const money = useMoneyFormat()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openSoldModal, setOpenSoldModal] = useState(false)

  const abbrTitle =
    `${order.products.map((p) => `- ${p.name} (x${p.quantity})\n`)}`.replace(
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
      <Table.D>{formatPhoneNumber(order.phone)}</Table.D>
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
          disabled={order.state === 'sold'}
        >
          Vender
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

function reverseData(obj: Record<string, IOrder>) {
  const newObj: Record<string, IOrder> = {}
  const revObj = Object.keys(obj).reverse()
  revObj.forEach(function (i) {
    newObj[i] = obj[i]
  })
  return newObj
}

export default function OrderPage() {
  const { register, watch } = useForm<IFilterData>({
    defaultValues: {
      orderBy: 'createdAt',
    },
    resolver: zodResolver(schema),
  })

  const [orderData, setOrderData] = useState<Record<string, IOrder>>({})
  const [loading, setLoading] = useState(true)
  const code = watch('code')

  useEffect(() => {
    const fetchProducts = async () => {
      const reference = ref(database, 'orders/')
      const orderQuery = code
        ? query(reference, orderByKey(), equalTo(code))
        : query(reference, orderByChild('createdAt'))

      onValue(orderQuery, (snapshot) => {
        const results: Record<string, IOrder> = {}
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

  async function updateOrderState(order: IOrder, state: 'sold' | 'not-sold') {
    let errorMessage = 'Erro ao alterar o estado do pedido'
    const soldProducts: IProduct[] = []

    try {
      if (state === 'sold') {
        for (const p of order.products) {
          const product = await getProduct(p.id)

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

      await update(ref(database, `orders/${order.id}`), {
        updatedAt: new Date().toISOString(),
        state,
      })

      for (const p of soldProducts) {
        const orderProduct = order.products.find((op) => op.id === p.id)

        if (orderProduct) {
          await update(ref(database, `products/${p.id}`), {
            quantity: p.quantity - orderProduct.quantity,
          })
        }
      }

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
      toast.error(errorMessage, {
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
                <TableRow
                  key={id}
                  order={{
                    ...order,
                    id,
                  }}
                  deleteOrder={() => deleteOrder(id)}
                  putAsSold={() => updateOrderState({ ...order, id }, 'sold')}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </DataState>
      </article>
    </section>
  )
}
