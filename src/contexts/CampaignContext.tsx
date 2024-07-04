'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'
import { child, get, ref } from 'firebase/database'

import { ICampaignBase } from '@/@types'
import { campaignValidator } from '@/functions'
import { database } from '@/lib/firebase/config'

interface ICampaignContext {
  campaignData: Record<string, ICampaignBase>
}

export const CampaignContext = createContext<ICampaignContext>({
  campaignData: {},
})

export default function CampaignProvider({
  children,
}: {
  children: ReactNode
}) {
  const [campaignData, setCampaignData] = useState<
    Record<string, ICampaignBase>
  >({})

  useEffect(() => {
    async function unsubscribed() {
      get(child(ref(database), 'campaigns/')).then((snapshot) => {
        if (snapshot.exists()) {
          const newObj: Record<string, ICampaignBase> = {}
          const obj = snapshot.val()
          let campaignDefaultId

          const revObj = Object.keys(obj).reverse()
          revObj.forEach(function (i) {
            if (campaignValidator(obj[i]) || obj[i].default === true) {
              if (obj[i].default) {
                campaignDefaultId = i
              }

              newObj[i] = obj[i]
            }
          })

          if (Object.entries(revObj).length >= 3 && campaignDefaultId) {
            delete newObj[campaignDefaultId]
          }

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
