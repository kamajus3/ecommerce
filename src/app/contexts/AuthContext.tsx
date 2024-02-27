'use client'

import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { auth } from '@/lib/firebase/config'
import { User, signInWithEmailAndPassword } from 'firebase/auth'

interface AuthContextProps {
  user: User | null | undefined
  initialized: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  setUser: Dispatch<SetStateAction<User | null | undefined>>
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  initialized: false,
  setUser: () => {},
  signInWithEmail: () => Promise.resolve(),
})

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>()

  async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        setUser(user)
      })
      .catch(() => {
        throw Error('Essa conta não existe')
      })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      }
      setInitialized(true)
    })
    return () => {
      unsubscribe()
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        initialized,
        signInWithEmail,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
