import { useContext } from 'react'
import { PromotionContext } from '@/app/contexts/PromotionContext'

export const usePromotion = () => {
  const value = useContext(PromotionContext)
  return value
}
