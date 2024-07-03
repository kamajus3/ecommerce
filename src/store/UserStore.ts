import { User } from 'firebase/auth'
import { create } from 'zustand'

import { UserDatabase } from '@/@types'

interface updateUserProps {
  metadata: User | null
  data: UserDatabase | null
}

interface UserState {
  metadata: User | null
  data: UserDatabase | null
  updateUser: (data: updateUserProps) => void
}

const useUserStore = create<UserState>()((set) => ({
  metadata: null,
  data: null,
  updateUser: (data) => set(() => data),
}))

export default useUserStore
