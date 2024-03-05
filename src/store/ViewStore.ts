import { database } from '@/lib/firebase/config'
import { ref, child, get, set as firebaseSet } from 'firebase/database'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ViewStore {
  productVieweds: string[]
  viewProduct: (id: string) => void
}

const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      productVieweds: [],
      viewProduct: (productId) => {
        set((state) => {
          if (!state.productVieweds.find((id) => id === productId)) {
            const dbRef = ref(database)

            get(child(dbRef, `views/${productId}`)).then((snapshot) => {
              if (snapshot.exists()) {
                firebaseSet(ref(database, `views/${productId}`), {
                  view: snapshot.val() + 1,
                })
              } else {
                firebaseSet(ref(database, `views/${productId}`), {
                  view: 1,
                })
              }
            })

            return {
              productVieweds: [...state.productVieweds, productId],
            }
          }
          return state
        })
      },
    }),
    {
      name: 'views-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useViewStore
