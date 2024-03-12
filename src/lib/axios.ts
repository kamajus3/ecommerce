import axios from 'axios'

export const invoiceApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_INVOICE_API_URL,
  responseType: 'blob',
  headers: {
    'x-api-key': 'c1a3de49-aa61-4f30-bbfb-cb64c6f5f6a0',
  },
})
