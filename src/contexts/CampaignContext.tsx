'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'
import { child, get, ref } from 'firebase/database'

import { CampaignBase } from '@/@types'
import { campaignValidator } from '@/functions'
import { database } from '@/lib/firebase/config'

interface CampaignContextProps {
  campaignData: Record<string, CampaignBase>
}

export const CampaignContext = createContext<CampaignContextProps>({
  campaignData: {},
})

export default function CampaignProvider({
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
          const newObj: Record<string, CampaignBase> = {}
          const obj = snapshot.val()

          const revObj = Object.keys(obj).reverse()
          revObj.forEach(function (i) {
            if (campaignValidator(obj[i]) || obj[i].default === true) {
              newObj[i] = obj[i]
            }
          })

          setCampaignData(newObj)
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
