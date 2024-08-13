'use client'

import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'

import { EnumUserRole, IUser } from '@/@types'
import { UserRepository } from '@/repositories/user.repository'
import { auth } from '@/services/firebase/config'
import useUserStore from '@/store/UserStore'

interface IAuthContext {
  initialized: boolean
  signInWithEmail: (
    email: string,
    password: string,
    userRole: EnumUserRole,
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
  const userRepository = useMemo(() => new UserRepository(), [])
  const [initialized, setInitialized] = useState<boolean>(false)
  const [userDBRole, setUserDBRole] = useState<EnumUserRole | undefined>()
  const updateUser = useUserStore((state) => state.updateUser)

  async function signInWithEmail(
    email: string,
    password: string,
    userRole: EnumUserRole,
  ) {
    setUserDBRole(userRole)
    const userData = await signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const userData = await userRepository.findById(user.uid)

        if (userData) {
          if (userData.role === userRole) {
            updateUser({
              metadata: user,
              data: userData,
            })

            return userData
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
        const data = await userRepository
          .create(
            {
              firstName: name,
              role: 'client',
            },
            user.uid,
          )
          .catch(() => {
            throw new Error('Aconteceu algum erro ao tentar criar a conta')
          })

        updateUser({
          metadata: user,
          data,
        })

        return data
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
        const userData = await userRepository.findById(user.uid)

        if (userData && (userDBRole === userData.role || !userDBRole)) {
          updateUser({
            metadata: user,
            data: userData,
          })
        }
        setUserDBRole(undefined)
      }
      setInitialized(true)
    })

    return () => {
      unsubscribe()
    }
  }, [userDBRole, updateUser, userRepository])

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
