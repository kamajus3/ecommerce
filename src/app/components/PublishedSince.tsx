import { formatDistanceToNowStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function PublishedSince({ date }: { date: string }) {
  function formatPublishedSince(date: string) {
    try {
      const publishedSince = formatDistanceToNowStrict(new Date(date), {
        locale: ptBR,
      })
      return `${publishedSince} atrás`
    } catch (e) {
      return ''
    }
  }

  return <span>{formatPublishedSince(date)}</span>
}
