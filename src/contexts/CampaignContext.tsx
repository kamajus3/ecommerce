'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'
import { child, get, ref } from 'firebase/database'

import { CampaignBase } from '@/@types'
import { database } from '@/lib/firebase/config'

interface CampaignContextProps {
  campaignData: Record<string, CampaignBase>
}

export const CampaignContext = createContext<CampaignContextProps>({
  campaignData: {},
})

export default function PromotionProvider({
  children,
}: {
  children: ReactNode
}) {
  const [campaignData, setCampaignData] = useState<
    Record<string, CampaignBase>
  >({})

  useEffect(() => {
    async function unsubscribed() {
      get(child(ref(database), 'campaigns/')).then((snapshot) => {
        if (snapshot.exists()) {
          setCampaignData(snapshot.val())
        }
      })
    }

    unsubscribed()
  }, [])

  return (
    <CampaignContext.Provider value={{ campaignData }}>
      {children}
    </CampaignContext.Provider>
  )
}
