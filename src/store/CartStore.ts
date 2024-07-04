import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { IProduct, IProductCart } from '@/@types'

interface ICartProduct extends IProduct {
  quantity: number
}

interface ICartState {
  products: IProductCart[]
  addProduct: (product: ICartProduct) => void
  removeProduct: (id: string) => void
}

const useCartStore = create<ICartState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) => {
        set((state) => {
          if (!state.products.find((p) => p.id === product.id)) {
            return {
              products: [...state.products, product],
            }
          }
          return state
        })
      },
      removeProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useCartStore
