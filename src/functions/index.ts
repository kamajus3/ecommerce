import { ProductPromotionObject } from '@/@types'
import axios from 'axios'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function URLtoFile(url: string) {
  try {
    const response = await fetch(url)
    const responseType = response.headers.get('content-type')
    const blob = await response.blob()
    if (responseType) {
      return new File([blob], 'product-photo', {
        type: responseType,
      })
    }
    throw Error('Erro ao converter URL para arquivo')
  } catch (error) {
    console.error('Erro ao converter URL para arquivo:', error)
    throw error
  }
}

export function publishedSince(date: string) {
  try {
    const publishedSince = formatDistanceToNowStrict(parseISO(date), {
      locale: ptBR,
    })

    if (parseISO(date) > new Date()) {
      return `daqui à ${publishedSince}`
    }
    return `${publishedSince} atrás`
  } catch (e) {
    return ''
  }
}

export function campaignValidator(
  promotion?: ProductPromotionObject,
): undefined | 'campaign' | 'promotion' {
  if (promotion) {
    const startDate = parseISO(promotion.startDate)
    const endDate = parseISO(promotion.finishDate)
    const currentDate = new Date()

    if (currentDate >= startDate && currentDate <= endDate) {
      if (promotion.reduction === 0) {
        return 'campaign'
      }
      return 'promotion'
    }
  }
}

export function hexToRGBA(hex: string, alpha: number): string {
  hex = hex.replace('#', '')

  const r: number = parseInt(hex.substring(0, 2), 16)
  const g: number = parseInt(hex.substring(2, 4), 16)
  const b: number = parseInt(hex.substring(4, 6), 16)

  const rgba: string = `rgba(${r}, ${g}, ${b}, ${alpha})`

  return rgba
}

export function downloadInvoice(orderId: string) {
  axios.get(`/invoice/${orderId}`).then((response) => {
    console.log(response)
  })
}
