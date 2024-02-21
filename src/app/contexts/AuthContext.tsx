'use client'

import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { auth } from '@/config/firebase'
import { User, signInWithEmailAndPassword } from 'firebase/auth'

interface AuthContextProps {
  user: User | null | undefined
  signInWithEmail: (email: string, password: string) => Promise<void>
  setUser: Dispatch<SetStateAction<User | null | undefined>>
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  signInWithEmail: () => Promise.resolve(),
})

export default function AuthProvider({ children }: { children: ReactNode }) {
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
    })
    return () => {
      unsubscribe()
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithEmail,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
