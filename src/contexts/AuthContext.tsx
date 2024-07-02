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
    userRole: UserRole,
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
  const [userDBRole, setUserDBRole] = useState<UserRole | undefined>()

  async function signInWithEmail(
    email: string,
    password: string,
    userRole: UserRole,
  ) {
    setUserDBRole(userRole)
    const userData = await signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const snapshot = await get(child(ref(database), `users/${user.uid}`))

        if (snapshot.exists()) {
          const userDBData = snapshot.val()
          if (snapshot.val().role === userRole) {
            setUser(user)
            setUserDB(userDBData)
            return userDBData
          }
          await auth.signOut()
        }
        throw new Error('Acounteceu algum erro ao tentar inciar sessão')
      })
      .catch((error: AuthError) => {
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
        ) {
          throw new Error('Acounteceu algum erro ao tentar inciar sessão')
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

        const userDBData = {
          id: user.uid,
          ...userData,
        }

        await set(ref(database, `users/${user.uid}`), userData).catch(() => {
          throw new Error('Aconteceu algum erro ao tentar criar a conta')
        })

        setUser(user)
        setUserDB(userDBData)

        return userDBData
      })
      .catch(() => {
        throw new Error('Aconteceu algum erro ao tentar criar a conta')
      })

    return userData
  }

  async function logout() {
    await auth.signOut()
    setUser(null)
    setUserDB(null)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const snapshot = await get(child(ref(database), `users/${user.uid}`))

        console.log(`é ${userDBRole === snapshot.val().role}`)
        console.log(`é ${userDBRole}`)
        console.log(`é ${!userDBRole}`)

        if (
          snapshot.exists() &&
          (userDBRole === snapshot.val().role || !userDBRole)
        ) {
          setUserDB(snapshot.val())
          setUser(user)
        }
        setUserDBRole(undefined)
      }
      setInitialized(true)
    })

    return () => {
      unsubscribe()
    }
  }, [user, userDBRole])

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
