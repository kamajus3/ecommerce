import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { ProductRepository } from '@/repositories/product.repository'
import { ProductViewRepository } from '@/repositories/product.view.repository'

const productViewRepository = new ProductViewRepository()
const productRepository = new ProductRepository()

interface IViewStore {
  vieweds: string[]
  viewProduct: (productId: string, userId: string) => void
}

const useViewStore = create<IViewStore>()(
  persist(
    (set, get) => ({
      vieweds: [],
      viewProduct: async (productId: string, userId: string) => {
        const state = get()
        if (!state.vieweds.includes(productId)) {
          const productView = await productViewRepository.find({
            filterBy: {
              userId,
              productId,
            },
          })

          if (productView.length === 0) {
            await productViewRepository.create({
              userId,
              productId,
            })
          }

          await productRepository.updateViews(productId)

          set({
            vieweds: [...state.vieweds, productId],
          })
        }
      },
    }),
    {
      name: 'views-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useViewStore
