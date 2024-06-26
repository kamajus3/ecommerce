import { CampaingPage } from './campaign'
import { Metadata } from 'next'
import { child, get, ref } from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { campaignValidator } from '@/functions'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  return new Promise((resolve) => {
    get(child(ref(database), `promotions/${params.id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        if (!campaignValidator(snapshot.val())) {
          resolve({
            title: 'Campanha não encontrada.',
          })
        }
        resolve({
          title: snapshot.val().title,
          description: snapshot.val().description.slice(0, 100) + '...',
          openGraph: {
            type: 'article',
            title: snapshot.val().title,
            description: snapshot.val().description,
            siteName: 'Racius Care',
            images: snapshot.val().photo,
          },
        })
      } else {
        resolve({
          title: 'Campanha não encontrada.',
        })
      }
    })
  })
}

export default function CampaingSearchPage() {
  return <CampaingPage />
}
