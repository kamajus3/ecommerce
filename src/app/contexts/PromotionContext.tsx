'use client'

import { PromotionItemBase } from '@/@types'
import { database } from '@/lib/firebase/config'
import { child, get, ref } from 'firebase/database'
import { ReactNode, createContext, useEffect, useState } from 'react'

interface PromotionContextProps {
  promotionData: Record<string, PromotionItemBase>
}

export const PromotionContext = createContext<PromotionContextProps>({
  promotionData: {},
})

export default function PromotionProvider({
  children,
}: {
  children: ReactNode
}) {
  const [promotionData, setPromotionData] = useState<
    Record<string, PromotionItemBase>
  >({})

  useEffect(() => {
    async function unsubscribed() {
      get(child(ref(database), `promotions`)).then((snapshot) => {
        if (snapshot.exists()) {
          setPromotionData(snapshot.val())
        }
      })
    }

    unsubscribed()
  }, [])

  return (
    <PromotionContext.Provider value={{ promotionData }}>
      {children}
    </PromotionContext.Provider>
  )
}
