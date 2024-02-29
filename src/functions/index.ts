import { ProductPromotionObject } from '@/@types'
import { formatDistanceToNowStrict } from 'date-fns'
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
    const publishedSince = formatDistanceToNowStrict(new Date(date), {
      locale: ptBR,
    })

    if (new Date(date) > new Date()) {
      return `Daqui à ${publishedSince}`
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
    const startDate = new Date(promotion?.startDate)
    const endDate = new Date(promotion?.finishDate)
    const currentDate = new Date()

    if (currentDate >= startDate && currentDate <= endDate) {
      if (promotion.reduction === 0) {
        return 'campaign'
      }
      return 'promotion'
    }
  }
}
