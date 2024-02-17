import { create } from 'zustand'
import { Product, ProductCart } from '@/@types'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CartProduct extends Product {
  quantity: number
}

interface CartState {
  products: ProductCart[]
  addProduct: (product: CartProduct) => void
  removeProduct: (id: string) => void
}

const useCartStore = create<CartState>()(
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
