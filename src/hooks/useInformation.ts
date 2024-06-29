import { useContext } from 'react'

import { InformationContext } from '@/contexts/InformationContext'

export const useInformation = () => {
  const value = useContext(InformationContext)
  return value
}
