import axios from 'axios'

const api = axios.create({
  baseURL: 'https://raciuscare-invoice.onrender.com/',
  timeout: 1000,
  headers: { 'x-api-key': process.env.INVOICE_API_URL },
})

export default api
