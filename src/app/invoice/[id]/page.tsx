'use client'

import React, { useState, useEffect } from 'react'
import { Document, Page, StyleSheet } from '@react-pdf/renderer'
import Html from 'react-pdf-html'
import { useParams } from 'next/navigation'
import { URLtoHTML } from '@/functions'
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
)

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    width: '100vw',
    height: '100vh',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
})

export default function Invoice() {
  const { id: orderId } = useParams<{ id: string }>()
  const [html, setHtml] = useState('')

  useEffect(() => {
    const fetchHtml = async () => {
      const htmlContent = await URLtoHTML(`/api/invoice/${orderId}`)
      console.log(htmlContent)

      setHtml(htmlContent)
    }

    fetchHtml()
  }, [orderId])

  return (
    <div className="h-screen w-screen">
      <PDFViewer className="h-full w-full" showToolbar={true}>
        <Document>
          <Page size="A4" style={styles.page}>
            <Html>{html}</Html>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
}
