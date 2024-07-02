import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { CampaignProduct } from '@/@types'

export async function URLtoFile(url: string) {
  const response = await fetch(url)
  const responseType = response.headers.get('content-type')
  const blob = await response.blob()
  if (responseType) {
    return new File([blob], 'product-photo', {
      type: responseType,
    })
  }
  throw Error('Erro ao converter URL para arquivo')
}

export function publishedSince(date: string): string {
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
  campaign?: CampaignProduct,
): undefined | 'campaign' | 'campaign-with-promotion' {
  if (
    campaign &&
    campaign.startDate &&
    campaign.finishDate &&
    campaign.reduction
  ) {
    const startDate = parseISO(campaign.startDate)
    const finishDate = parseISO(campaign.finishDate)
    const currentDate = new Date()

    if (currentDate >= startDate && currentDate <= finishDate) {
      if (Number(campaign.reduction) === 0) {
        return 'campaign'
      }

      return 'campaign-with-promotion'
    }
  }
}

export function hexToRGBA(hex: string, alpha: number): string {
  hex = hex.replace('#', '')

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`

  return rgba
}
