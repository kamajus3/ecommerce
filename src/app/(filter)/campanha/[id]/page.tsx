import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { child, get, ref } from 'firebase/database'

import { campaignValidator, formatPhotoUrl } from '@/functions'
import { database } from '@/services/firebase/config'

import { CampaingPage } from './campaign'

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string }
}): Promise<Metadata> {
  return new Promise((resolve) => {
    get(child(ref(database), `campaigns/${id}`)).then((snapshot) => {
      let data = snapshot.val()
      if (snapshot.exists() && data) {
        data = { ...snapshot.val(), id }

        if (!campaignValidator(data)) {
          resolve({
            title: 'Campanha não encontrada',
          })

          notFound()
        }

        resolve({
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
          },
        })
      } else {
        resolve({
          title: 'Campanha não encontrada',
        })

        notFound()
      }
    })
  })
}

export default function CampaingSearchPage() {
  return <CampaingPage />
}
