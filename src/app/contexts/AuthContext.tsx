'use client'

import React, { useState, useEffect, createContext, ReactNode } from 'react'
import { auth, database } from '@/config/firebase'
import { User, signInWithEmailAndPassword } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth/cordova'
import { ref, set, child, get } from 'firebase/database'

interface UserDatabase {
  id: string
  firstName: string
  lastName?: string
  address?: string
  email: string
  phone?: string
}

interface AuthContextProps {
  user: User | null | undefined
  userDatabase: UserDatabase | null | undefined
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (
    firstName: string,
    email: string,
    password: string,
  ) => Promise<void>
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userDatabase: null,
  signInWithEmail: () => Promise.resolve(),
  signUpWithEmail: () => Promise.resolve(),
})

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>()
  const [userDatabase, setUserDatabase] = useState<UserDatabase | null>()

  async function getUserFromDatabase(id: string) {
    const dbRef = ref(database)
    get(child(dbRef, `users/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUserDatabase(snapshot.val())
        } else {
          console.log('No data available')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        setUser(user)
        await getUserFromDatabase(user.uid)
      })
      .catch(() => {
        throw Error('Essa conta não existe')
      })
  }

  async function signUpWithEmail(
    firstName: string,
    email: string,
    password: string,
  ) {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        set(ref(database, 'users/' + user.uid), {
          firstName,
          email,
        })
        setUser(user)
        setUserDatabase({
          email,
          firstName,
          id: user.uid,
        })
      })
      .catch((e) => {
        console.log(e)
        throw Error('Houve algum erro ao tentar criar a conta')
      })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
        getUserFromDatabase(user.uid)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{ user, userDatabase, signInWithEmail, signUpWithEmail }}
    >
      {children}
    </AuthContext.Provider>
  )
}
