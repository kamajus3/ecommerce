'use client'

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth'
import { child, get, ref, set } from 'firebase/database'

import { UserDatabase, UserRole } from '@/@types'
import { auth, database } from '@/lib/firebase/config'

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
    const userData = await signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const snapshot = await get(
          child(ref(database), `users/${user.uid}`),
        ).catch(() => {
          throw new Error('Acounteceu algum erro ao tentar inciar sessão')
        })

        if (snapshot.exists()) {
          setUser(user)
          setUserDB(snapshot.val())
          return snapshot.val() as UserDatabase
        }
        throw new Error('Acounteceu algum erro ao tentar inciar sessão')
      })
      .catch((error: AuthError) => {
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
        ) {
          throw new Error('Essa conta não existe')
        }
        throw new Error('Acounteceu algum erro ao tentar inciar sessão')
      })

    return userData
  }

  async function signUpWithEmail(
    name: string,
    email: string,
    password: string,
  ) {
    const userData = await createUserWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const userData = {
          firstName: name,
          phone: user.phoneNumber || '',
          role: 'client' as UserRole,
        }

        await set(ref(database, `users/${user.uid}`), userData).catch(() => {
          throw new Error('Acounteceu algum erro ao criar uma conta')
        })

        setUser(user)
        setUserDB({
          id: user.uid,
          ...userData,
        })

        return {
          ...userData,
          id: user.uid,
        }
      })
      .catch(() => {
        throw new Error('Aconteceu algum erro ao tentar criar a conta')
      })

    return userData
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
