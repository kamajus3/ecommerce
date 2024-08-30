'use client'

import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { notFound, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import FileSaver from 'file-saver'

import { IOrder } from '@/@types'
import Button from '@/components/Button'
import Device from '@/components/Device'
import Loading from '@/components/Loading'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from '@/navigation'
import { OrderRepository } from '@/repositories/order.repository'
import useUserStore from '@/store/UserStore'
import { pdf } from '@react-pdf/renderer'

import { InvoiceStructure } from '../components/InvoiceStructure'

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <Loading />,
  },
)

export default function Invoice() {
  const orderRepository = useMemo(() => new OrderRepository(), [])

  const userDB = useUserStore((state) => state.data)
  const [orderData, setOrderData] = useState<IOrder>()
  const { initialized } = useAuth()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const t = useTranslations('invoice')

  useEffect(() => {
    async function fetchOrderData() {
      if (!userDB && initialized) {
        return router.replace('/login')
      }

      const order = await orderRepository.findById(id)

      if (!order && initialized) {
        notFound()
      }

      if (
        order &&
        userDB &&
        initialized &&
        userDB.id !== order.userId &&
        userDB.role === 'client'
      ) {
        return router.replace('/login')
      }

      if (initialized && order) {
        setOrderData(order)
      }
    }
    fetchOrderData()
  }, [id, initialized, orderRepository, router, userDB])

  function downloadInvoice() {
    if (orderData) {
      const invoice = pdf(<InvoiceStructure t={t} order={orderData} />).toBlob()

      invoice.then((blob) => {
        FileSaver.saveAs(blob, `factura-${id}.pdf`)
      })
    }
  }

  if (!orderData || !initialized) {
    return <Loading />
  }

  return (
    <Device>
      {({ isMobile }) => {
        if (isMobile) {
          return (
            <div className="bg-white h-screen w-screen flex items-center justify-center">
              <Button onClick={downloadInvoice}>{t('table.action')}</Button>
            </div>
          )
        }
        return (
          <div className="h-screen w-screen">
            <PDFViewer className="h-full w-full" showToolbar={true}>
              <InvoiceStructure t={t} order={orderData} />
            </PDFViewer>
          </div>
        )
      }}
    </Device>
  )
}
