'use client'

import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'

import { ICampaignBase } from '@/@types'
import { campaignValidator } from '@/functions'
import { CampaignRepository } from '@/repositories/campaign.repository'

interface ICampaignContext {
  campaignData: ICampaignBase[]
}

export const CampaignContext = createContext<ICampaignContext>({
  campaignData: [],
})

export default function CampaignProvider({
  children,
}: {
  children: ReactNode
}) {
  const [campaignData, setCampaignData] = useState<ICampaignBase[]>([])
  const campaignRepository = useMemo(() => new CampaignRepository(), [])

  useEffect(() => {
    async function unsubscribed() {
      let campaignData = await campaignRepository.findAll()

      for (const campaign of campaignData) {
        if (campaignValidator(campaign)) {
          if (campaignData.length >= 3 && campaign.default) {
            campaignData = campaignData.filter((c) => c.id !== campaign.id)
          }
        }
      }

      setCampaignData(campaignData)
    }

    unsubscribed()
  }, [campaignRepository])

  return (
    <CampaignContext.Provider value={{ campaignData }}>
      {children}
    </CampaignContext.Provider>
  )
}
