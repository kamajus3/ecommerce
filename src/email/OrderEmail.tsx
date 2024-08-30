import React from 'react'

import { IOrder, LocaleKey } from '@/@types'
import { env } from '@/env'
import { calculateDiscountedPrice } from '@/functions'
import { formatMoney, formatPhoneNumber } from '@/functions/format'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Text,
} from '@react-email/components'

import '@/assets/order-email.css'

interface ISendOrder extends IOrder {
  totalPrice: number
}

interface IOrderEmail {
  order: ISendOrder
  locale: LocaleKey
}

export function OrderEmail({
  order: { products, ...order },
  locale,
}: IOrderEmail) {
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

  return (
    <Html>
      <Head />
      <Body className="order-email">
        <Container className="order-email order-email-container">
          <Text>You received a new order #{order.id}:</Text>

          <Heading as="h3">Customer:</Heading>
          <Text>
            <strong>Name:</strong> {order.firstName} {order.lastName}
            <br />
            <strong>Phone:</strong>{' '}
            {formatPhoneNumber(`+${order.phone.ddd}${order.phone.number}`)}
            <br />
            <strong>Address:</strong> {order.address}
          </Text>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {finalProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>{product.promotion}</td>
                  <td>{product.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Text>
            <strong>Total Amount Due: </strong>
            {formatMoney(order.totalPrice)}
          </Text>
          <Text>
            <Link
              href={`${env.NEXT_PUBLIC_WEBSITE_URL}/${locale}/invoice/${order.id}`}
              target="_blank"
            >
              Click here to view the pro forma invoice
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
