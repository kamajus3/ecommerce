'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import FileSaver from 'file-saver'
import { child, get, ref } from 'firebase/database'

import { Order, ProductOrder } from '@/@types'
import Button from '@/components/ui/Button'
import Device from '@/components/ui/Device'
import Loading from '@/components/ui/Loading'
import { database } from '@/lib/firebase/config'
import {
  Document,
  Font,
  Image,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '/fonts/Roboto-Regular.ttf',
    },
    {
      src: '/fonts/Roboto-Bold.ttf',
    },
  ],
})

Font.register({
  family: 'Madimi One',
  src: '/fonts/MadimiOne-Regular.ttf',
})

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <Loading />,
  },
)

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#14213d',
    lineHeight: 1.6,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 125,
  },
  title: {
    fontFamily: 'Madimi One',
    fontSize: 25,
    color: '#201D63',
  },
  companyInfo: {
    marginBottom: 40,
  },
  boldText: {
    fontWeight: 'bold',
  },
  customerInfo: {
    marginBottom: 40,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 30,
  },
  th: {
    borderBottom: '1px solid #a9a',
    color: '#a9a',
    fontWeight: 400,
    paddingBottom: 8,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 10,
  },
  td: {
    paddingTop: 20,
    textAlign: 'center',
  },
  lastTd: {
    color: '#201D63',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalTable: {
    borderColor: '#f6f6f6',
    borderWidth: 2,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    fontSize: 20,
  },
})

const calculateTotalPrice = (products: ProductOrder[]) => {
  let totalPrice = 0
  products.forEach((product) => {
    const discountedPrice = calculateDiscount(product.price, product.promotion)
    totalPrice += discountedPrice * product.quantity
  })
  return totalPrice
}

const formatISODate = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.toLocaleString()
}

const moneyFormat = Intl.NumberFormat('en-DE', {
  style: 'currency',
  currency: 'AOA',
})
const formatCurrency = (amount: number) => moneyFormat.format(amount)

const calculateDiscount = (
  price: number,
  promotion: number | null | undefined,
) => (promotion ? price - (price * promotion) / 100 : price)

const InvoiceBody = ({ orderData }: { orderData: Order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src="/logo.png" />
        <Text style={styles.title}>Factura profomora</Text>
      </View>

      <View style={styles.companyInfo}>
        <Text style={styles.boldText}>
          RACIUS CARE - COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS
        </Text>
        <Text>NIF: 5001866150</Text>
        <Text>
          Endereço: Rua Amilcar Cabral, Bloco A12, 7°A, P73, Distrito Urbano do
          Kilamba, Belas, Luanda, Angola
        </Text>
        <Text>Tel.: +244 935 420 498</Text>
        <Text>Email: geral@raciuscare.com</Text>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.boldText}>Dados do cliente</Text>
        <Text>
          Nome: {orderData.firstName} {orderData.lastName}
        </Text>
        <Text>Telefone: {orderData.phone}</Text>
        <Text>Endereço: {orderData.address}</Text>
      </View>

      <View>
        <View style={styles.table}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.th, { flex: 1 }]}>Descrição</Text>
            <Text style={[styles.th, { flex: 0.5 }]}>IVA(%)</Text>
            <Text style={[styles.th, { flex: 0.5 }]}>Desc.</Text>
            <Text style={[styles.th, { flex: 0.5 }]}>Qtd.</Text>
            <Text style={[styles.th, { flex: 1 }]}>Valor unit.</Text>
            <Text style={[styles.th, { flex: 1 }]}>Total unit.</Text>
          </View>
          {orderData.products.map((product, index: number) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <Text style={[styles.td, { flex: 1, textAlign: 'left' }]}>
                {product.name}
              </Text>
              <Text style={[styles.td, { flex: 0.5 }]}>-</Text>
              <Text style={[styles.td, { flex: 0.5 }]}>
                {product.promotion ? `${product.promotion}%` : '-'}
              </Text>
              <Text style={[styles.td, { flex: 0.5 }]}>{product.quantity}</Text>
              <Text style={[styles.td, { flex: 0.5 }]}>
                {formatCurrency(product.price)}
              </Text>
              <Text style={[styles.td, { flex: 0.5 }]}>
                {formatCurrency(
                  calculateDiscount(product.price, product.promotion),
                )}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totalTable}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.th, { flex: 1 }]}>Referência</Text>
          <Text style={[styles.th, { flex: 1 }]}>Data</Text>
          <Text style={[styles.th, { flex: 1 }]}>Total a pagar</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.td, { flex: 0.5 }]}>{orderData.id}</Text>
          <Text style={[styles.td, { flex: 0.5 }]}>
            {formatISODate(orderData.createdAt)}
          </Text>
          <Text style={[styles.td, { flex: 0.5 }]}>
            {formatCurrency(calculateTotalPrice(orderData.products))}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
)

export default function Invoice() {
  const [orderData, setOrderData] = useState<Order | undefined>()
  const { id: orderId } = useParams<{ id: string }>()

  useEffect(() => {
    async function fetchOrderData() {
      const snapshot = await get(child(ref(database), `orders/${orderId}`))
      if (snapshot.exists()) {
        setOrderData(snapshot.val())
      }
    }
    fetchOrderData()
  }, [orderId])

  if (!orderData) {
    return <Loading />
  }

  const invoice = pdf(
    <InvoiceBody orderData={{ ...orderData, id: orderId }} />,
  ).toBlob()

  function downloadInvoice() {
    invoice.then((blob) => {
      FileSaver.saveAs(blob, `factura-${orderId}.pdf`)
    })
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
              <InvoiceBody orderData={{ ...orderData, id: orderId }} />
            </PDFViewer>
          </div>
        )
      }}
    </Device>
  )
}
