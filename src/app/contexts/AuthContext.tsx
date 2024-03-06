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
import { child, get, ref, set } from 'firebase/database'

interface UserDatabase {
  id: string
  firstName: string
  lastName?: string
  address?: string
  email: string
  phone?: string
  privileges: string[]
}

interface AuthContextProps {
  user: User | null | undefined
  userDB: UserDatabase | null | undefined
  setUserDB: React.Dispatch<
    React.SetStateAction<UserDatabase | null | undefined>
  >
  initialized: boolean
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<UserDatabase | null>
  signUpWithEmail: (
    name: string,
    email: string,
    password: string,
  ) => Promise<UserDatabase | null>
  logout(): Promise<void>
  setUser: Dispatch<SetStateAction<User | null | undefined>>
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userDB: null,
  setUserDB: () => {},
  initialized: false,
  setUser: () => {},
  signInWithEmail: () => Promise.resolve(null),
  signUpWithEmail: () => Promise.resolve(null),
  logout: () => Promise.resolve(),
})

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>()
  const [userDB, setUserDB] = useState<UserDatabase | null>()

  async function signInWithEmail(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      const snapshot = await get(child(ref(database), `users/${user.uid}`))
      if (snapshot.exists()) {
        setUser(user)
        setUserDB(snapshot.val())
        return snapshot.val()
      }
      return null
    } catch (error) {
      throw new Error('Essa conta não existe')
    }
  }

  async function signUpWithEmail(email: string, password: string) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const userData = {
        firstName: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        privileges: ['create-orders'],
      }

      await set(ref(database, `users/${user.uid}`), userData)

      setUser(user)
      setUserDB({
        id: user.uid,
        ...userData,
      })

      return {
        ...userData,
        id: user.uid,
      }
    } catch (error) {
      throw new Error('Houve um erro ao tentar criar a conta')
    }
  }

  async function logout() {
    await auth.signOut().then(() => {
      setUser(null)
      setUserDB(null)
    })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        get(child(ref(database), `users/${user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setUserDB(snapshot.val())
          }
        })

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
        userDB,
        setUserDB,
        initialized,
        signInWithEmail,
        signUpWithEmail,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
