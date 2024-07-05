import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ICampaign } from '@/@types'
import { formatPhotoUrl } from '@/functions'
import { getCampaign } from '@/services/firebase/database'

import { CampaingPage } from './campaign'

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string }
}): Promise<Metadata> {
  return getCampaign(id)
    .then((data) => {
      return {
        title: data.title,
        description:
          data.description.length <= 100
            ? data.description
            : `${data.description.slice(0, 100)}...`,
        openGraph: {
          type: 'article',
          title: data.title,
          description: data.description,
          siteName: 'Racius Care',
          images: formatPhotoUrl(data.photo, data.updatedAt),
          notFound: true,
        },
      }
    })
    .catch(() => {
      return {
        title: 'Campanha não encontrada.',
        description:
          'Desculpe, mas a campanha que você tentou acessar não foi encontrada.',
        notFound: true,
      }
    })
}

export default async function CampaingSearchPage({
  params: { id },
}: {
  params: { id: string }
}) {
  let campaign: ICampaign

  try {
    campaign = await getCampaign(id)
  } catch {
    notFound()
  }
  return <CampaingPage {...campaign} />
}
