'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { notFound, useParams, useRouter } from 'next/navigation'
import FileSaver from 'file-saver'

import { IOrder } from '@/@types'
import Button from '@/components/ui/Button'
import Device from '@/components/ui/Device'
import Loading from '@/components/ui/Loading'
import { useAuth } from '@/hooks/useAuth'
import { getOrder } from '@/lib/firebase/database'
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
  const userDB = useUserStore((state) => state.data)
  const [orderData, setOrderData] = useState<IOrder>()
  const { initialized } = useAuth()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    async function fetchOrderData() {
      if (!userDB && initialized) {
        return router.replace('/login')
      }

      const orderDataDB = await getOrder(id)

      if (!orderDataDB && initialized) {
        notFound()
      }

      if (
        orderDataDB &&
        userDB &&
        initialized &&
        userDB.id !== orderDataDB.userId &&
        userDB.role === 'client'
      ) {
        return router.replace('/login')
      }

      if (initialized) {
        setOrderData(orderDataDB)
      }
    }
    fetchOrderData()
  }, [id, initialized, router, userDB])

  function downloadInvoice() {
    if (orderData) {
      const invoice = pdf(
        <InvoiceStructure orderData={{ ...orderData, id }} />,
      ).toBlob()

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
              <Button onClick={downloadInvoice}>Baixar factura</Button>
            </div>
          )
        }
        return (
          <div className="h-screen w-screen">
            <PDFViewer className="h-full w-full" showToolbar={true}>
              <InvoiceStructure orderData={{ ...orderData, id }} />
            </PDFViewer>
          </div>
        )
      }}
    </Device>
  )
}
