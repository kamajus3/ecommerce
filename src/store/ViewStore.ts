import { child, get, ref, set as firebaseSet } from 'firebase/database'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { database } from '@/services/firebase/config'

interface IViewStore {
  productVieweds: string[]
  viewProduct: (id: string) => void
}

const useViewStore = create<IViewStore>()(
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
                  view: snapshot.val().view + 1,
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
