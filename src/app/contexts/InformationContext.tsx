'use client'

import { database } from '@/lib/firebase/config'
import { child, get, ref } from 'firebase/database'
import { ReactNode, createContext, useEffect, useState } from 'react'

interface InformationsProps {
  promotionFixed: string | null
}

interface InformationContextProps {
  informationsData: InformationsProps
}

export const InformationContext = createContext<InformationContextProps>({
  informationsData: {
    promotionFixed: null,
  },
})

export default function InformationProvider({
  children,
}: {
  children: ReactNode
}) {
  const [informationsData, setInformationsData] = useState<InformationsProps>({
    promotionFixed: null,
  })

  useEffect(() => {
    async function unsubscribed() {
      get(child(ref(database), 'informations')).then((snapshot) => {
        if (snapshot.exists()) {
          setInformationsData(snapshot.val())
        }
      })
    }

    unsubscribed()
  }, [])

  return (
    <InformationContext.Provider value={{ informationsData }}>
      {children}
    </InformationContext.Provider>
  )
}
