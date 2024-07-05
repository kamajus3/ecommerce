import { IOrder } from '@/@types'
import { env } from '@/env'
import {
  calculateDiscountedPrice,
  formatMoney,
  formatPhoneNumber,
} from '@/functions'
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
  totalPrice,
}: ISendOrder) {
  const finalProducts = products.map((p) => {
    const price = formatMoney(p.price)
    const promotion = p.promotion ? `${p.promotion}%` : '-'

    return {
      ...p,
      price,
      promotion,
      totalPrice: formatMoney(
        calculateDiscountedPrice(p.price, p.quantity, p.promotion),
      ),
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
      totalPrice: formatMoney(totalPrice),
      invoiceUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/factura/${id}`,
    },
  )
}
