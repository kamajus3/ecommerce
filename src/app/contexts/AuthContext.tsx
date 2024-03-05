'use client'

import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { auth, database } from '@/lib/firebase/config'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { ref, set } from 'firebase/database'

interface AuthContextProps {
  user: User | null | undefined
  initialized: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  setUser: Dispatch<SetStateAction<User | null | undefined>>
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  initialized: false,
  setUser: () => {},
  signInWithEmail: () => Promise.resolve(),
  signUpWithEmail: () => Promise.resolve(),
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

  async function signUpWithEmail(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        set(ref(database, `users/${user.uid}`), {
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber,
          rules: ['create-orders'],
        })
        setUser(user)
      })
      .catch(() => {
        throw Error('Houve um erro ao tentar criar a conta')
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
        signUpWithEmail,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
