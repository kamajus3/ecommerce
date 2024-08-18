import { useTranslations } from 'next-intl'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { IProductCampaign } from '@/@types'

export const calculateDiscountedPrice = (
  price: number,
  quantity: number,
  reduction: number | string | undefined | null,
) => {
  if (reduction && Number(reduction) !== 0) {
    return price * quantity * (1 - Number(reduction) / 100)
  }
  return price * quantity
}

export async function URLtoFile(url: string) {
  const response = await fetch(url)
  const responseType = response.headers.get('content-type')
  const blob = await response.blob()
  if (responseType) {
    return new File([blob], 'photo', {
      type: responseType,
    })
  }
  throw Error('Erro ao converter URL para arquivo')
}

export function publishedSince(date: string): string {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations('time')

  try {
    const publishedSince = formatDistanceToNowStrict(parseISO(date), {
      locale: ptBR,
    })

    if (parseISO(date) > new Date()) {
      return t('fromNow', {
        publishedSince,
      })
    }
    return t('ago', {
      publishedSince,
    })
  } catch (e) {
    return ''
  }
}

export function campaignValidator(
  campaign?: IProductCampaign,
): undefined | 'campaign' | 'promotional-campaign' {
  if (
    campaign &&
    campaign.startDate &&
    campaign.endDate &&
    campaign.reduction
  ) {
    const startDate = parseISO(campaign.startDate)
    const endDate = parseISO(campaign.endDate)
    const currentDate = new Date()

    if (currentDate >= startDate && currentDate <= endDate) {
      if (Number(campaign.reduction) === 0) {
        return 'campaign'
      }

      return 'promotional-campaign'
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

export function calculateTimeRemaining(endDate: Date) {
  const currentTime = new Date().getTime()
  const finishTime = new Date(endDate).getTime()

  if (finishTime < currentTime) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const timeDiff = finishTime - currentTime

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}
