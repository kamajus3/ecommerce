import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function URLtoHTML(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Erro ao buscar URL')
    }

    const html = await response.text()
    return html
  } catch (error) {
    console.error('Erro ao converter URL para HTML:', error)
    throw error
  }
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

export function campaignValidator(promotion?: {
  startDate: string
  finishDate: string
  reduction: number
}): undefined | 'campaign' | 'promotion' {
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

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`

  return rgba
}
