import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { formatPhotoUrl } from '@/functions/format'
import { CampaignRepository } from '@/repositories/campaign.repository'

import { CampaingPage } from './campaign'

const campaignRepository = new CampaignRepository()
export async function generateMetadata({
  params: { id },
}: {
  params: { id: string }
}): Promise<Metadata> {
  const campaign = await campaignRepository.findById(id)

  if (campaign) {
    return {
      title: campaign.title,
      description:
        campaign.description.length <= 100
          ? campaign.description
          : `${campaign.description.slice(0, 100)}...`,
      openGraph: {
        type: 'article',
        title: campaign.title,
        description: campaign.description,
        siteName: 'Poubelle',
        images: formatPhotoUrl(campaign.photo, campaign.updatedAt),
      },
    }
  } else {
    return {
      title: 'Campanha não encontrada.',
      description:
        'Desculpe, mas a campanha que você tentou acessar não foi encontrada.',
    }
  }
}

export default async function CampaingSearchPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const campaign = await campaignRepository.findById(id)

  if (!campaign) {
    notFound()
  }

  return <CampaingPage {...campaign} />
}
