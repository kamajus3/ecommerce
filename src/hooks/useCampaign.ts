import { useContext } from 'react'

import { CampaignContext } from '@/contexts/CampaignContext'

export const useCampaign = () => {
  const value = useContext(CampaignContext)
  return value
}
