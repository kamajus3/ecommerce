import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

import constants from '@/constants'

export default getRequestConfig(async ({ locale }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!constants.locales.includes(locale as any)) notFound()

  return {
    messages: {
      categories: (await import(`../messages/${locale}/categories.json`))
        .default,
      campaign: (await import(`../messages/${locale}/campaign.json`)).default,
      time: (await import(`../messages/${locale}/time.json`)).default,
      structure: (await import(`../messages/${locale}/structure.json`)).default,
      product: (await import(`../messages/${locale}/product.json`)).default,
      form: (await import(`../messages/${locale}/form.json`)).default,
      invoice: (await import(`../messages/${locale}/invoice.json`)).default,
      search: (await import(`../messages/${locale}/search.json`)).default,
      cart: (await import(`../messages/${locale}/cart.json`)).default,
      auth: (await import(`../messages/${locale}/auth.json`)).default,
      admin: {
        dashboard: (await import(`../messages/${locale}/admin/dashboard.json`))
          .default,
        product: (await import(`../messages/${locale}/admin/product.json`))
          .default,
        order: (await import(`../messages/${locale}/admin/order.json`)).default,
        campaign: (await import(`../messages/${locale}/admin/campaign.json`))
          .default,
      },
      '404': (await import(`../messages/${locale}/404.json`)).default,
    },
  }
})
