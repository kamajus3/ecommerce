import { IOrder } from '@/@types'
import { env } from '@/env'
import { calculateDiscountedPrice } from '@/functions'
import { formatMoney, formatPhoneNumber } from '@/functions/format'
import { send } from '@emailjs/browser'

import './config'

interface IOrderData extends IOrder {
  totalPrice: number
  email: string
}

interface ISendOrder {
  order: IOrderData
  locale: string
}

export default function sendOrder({
  order: {
    id,
    firstName,
    email,
    phone,
    lastName,
    address,
    products,
    totalPrice,
  },
  locale,
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
      phone: formatPhoneNumber(`+${phone.ddd}${phone.number}`),
      email,
      address,
      products: finalProducts,
      totalPrice: formatMoney(totalPrice),
      invoiceUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/${locale}/invoice/${id}`,
    },
  )
}
