import { IOrder } from '@/@types'
import { env } from '@/env'
import { formatPhoneNumber } from '@/functions'
import { send } from '@emailjs/browser'

import './config'

interface ISendOrder extends IOrder {
  totalPrice: number
  email: string
}

export default function sendOrder({
  id,
  firstName,
  email,
  phone,
  lastName,
  address,
  products,
}: ISendOrder) {
  const money = Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'AOA',
  })

  const finalProducts = products.map((p) => {
    const price = money.format(p.price)
    const promotion = p.promotion ? `${p.promotion}%` : '-'

    return {
      ...p,
      price,
      promotion,
    }
  })

  send(
    env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ORDER,
    {
      id,
      firstName,
      lastName,
      phone: formatPhoneNumber(phone),
      email,
      address,
      products: finalProducts,
      invoiceUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/invoice/${id}`,
    },
  )
}
