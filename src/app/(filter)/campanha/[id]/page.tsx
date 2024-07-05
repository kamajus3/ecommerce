import { Metadata } from 'next'
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
      if (snapshot.exists()) {
        const data = snapshot.val()
        console.log(data)

        if (!campaignValidator(data)) {
          resolve({
            title: 'Campanha invalida.',
          })

          return { notFound: true }
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
          title: 'Campanha não encontrada.',
        })

        return { notFound: true }
      }
    })
  })
}

export default function CampaingSearchPage() {
  return <CampaingPage />
}
