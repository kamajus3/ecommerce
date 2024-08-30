import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { formatPhotoUrl } from '@/functions/format'
import { CampaignRepository } from '@/repositories/campaign.repository'

import { Campaign } from '../components/Campaign'

const campaignRepository = new CampaignRepository()

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string }
}): Promise<Metadata> {
  const t = await getTranslations('search')
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
      title: t('search.notFound'),
    }
  }
}

export default async function CampaingPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const campaign = await campaignRepository.findById(id)

  if (!campaign) {
    return notFound()
  }

  return <Campaign {...campaign} />
}
