'use client'

import React, { createContext, ReactNode, useEffect, useState } from 'react'
import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { child, get, ref, set } from 'firebase/database'

import { IUser, UserRole } from '@/@types'
import { auth, database } from '@/lib/firebase/config'
import useUserStore from '@/store/UserStore'

interface IAuthContext {
  initialized: boolean
  signInWithEmail: (
    email: string,
    password: string,
    userRole: UserRole,
  ) => Promise<IUser | null>
  signUpWithEmail: (
    name: string,
    email: string,
    password: string,
  ) => Promise<IUser | null>
  logout(): Promise<void>
}

export const AuthContext = createContext<IAuthContext>({
  initialized: false,
  signInWithEmail: () => Promise.resolve(null),
  signUpWithEmail: () => Promise.resolve(null),
  logout: () => Promise.resolve(),
})

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState<boolean>(false)
  const [userDBRole, setUserDBRole] = useState<UserRole | undefined>()
  const updateUser = useUserStore((state) => state.updateUser)

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
          const userDBData = {
            id: user.uid,
            ...snapshot.val(),
          }
          if (snapshot.val().role === userRole) {
            updateUser({
              metadata: user,
              data: userDBData,
            })

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

        updateUser({
          metadata: user,
          data: userDBData,
        })

        return userDBData
      })
      .catch(() => {
        throw new Error('Aconteceu algum erro ao tentar criar a conta')
      })

    return userData
  }

  async function logout() {
    await auth.signOut()
    updateUser({
      metadata: null,
      data: null,
    })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const snapshot = await get(child(ref(database), `users/${user.uid}`))

        if (
          snapshot.exists() &&
          (userDBRole === snapshot.val().role || !userDBRole)
        ) {
          updateUser({
            metadata: user,
            data: {
              id: user.uid,
              ...snapshot.val(),
            },
          })
        }
        setUserDBRole(undefined)
      }
      setInitialized(true)
    })

    return () => {
      unsubscribe()
    }
  }, [userDBRole, updateUser])

  return (
    <AuthContext.Provider
      value={{
        initialized,
        signInWithEmail,
        signUpWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
