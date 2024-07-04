import { User } from 'firebase/auth'
import { create } from 'zustand'

import { IUser } from '@/@types'

interface IUpdateUser {
  metadata: User | null
  data: IUser | null
}

interface UserState {
  metadata: User | null
  data: IUser | null
  updateUser: (data: IUpdateUser) => void
}

const useUserStore = create<UserState>()((set) => ({
  metadata: null,
  data: null,
  updateUser: (data) => set(() => data),
}))

export default useUserStore
