import { NextApiRequest } from 'next'

import { IOrder, LocaleKey } from '@/@types'
import { OrderEmail } from '@/email/OrderEmail'
import { env } from '@/env'
import { transporter } from '@api/services/email'
import { render } from '@react-email/components'

interface ISendOrder extends IOrder {
  totalPrice: number
}

interface FormData {
  order: ISendOrder
  locale: LocaleKey
}

export async function POST(req: NextApiRequest) {
  try {
    const body: FormData = await new Response(req.body).json()

    const emailHtml = await render(OrderEmail(body))

    const options = {
      from: `Poubelle ecommerce <${env.SMTP_SENDER_EMAIL}>`,
      to: env.NEXT_PUBLIC_EMAIL_ADDRESS,
      subject: '🔴',
      html: emailHtml,
    }

    await transporter.sendMail(options)

    return Response.json({ message: 'Order email sent successfully' })
  } catch (error) {
    console.error(error)

    return new Response('Failed to send order email', { status: 500 })
  }
}
