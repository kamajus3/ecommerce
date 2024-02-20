'use client'

import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { auth, database } from '@/config/firebase'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import { ref, set, child, get } from 'firebase/database'
import { Bounce, toast } from 'react-toastify'

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
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  setUserDatabase: Dispatch<SetStateAction<UserDatabase | null | undefined>>
  setUser: Dispatch<SetStateAction<User | null | undefined>>
  signUpWithEmail: (
    firstName: string,
    email: string,
    password: string,
  ) => Promise<void>
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userDatabase: null,
  setUserDatabase: () => {},
  setUser: () => {},
  signInWithGoogle: () => Promise.resolve(),
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
          throw Error('Essa conta não existe')
        }
      })
      .catch((e: Error) => {
        toast.error(e.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        })
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
      .catch(() => {
        throw Error('Houve algum erro ao tentar criar a conta!')
      })
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      await getUserFromDatabase(result.user.uid).catch(() => {
        // If user not exists
        set(ref(database, 'users/' + result.user.uid), {
          firstName: result.user.displayName,
          email: result.user.email,
        })
      })

      setUser(result.user)
      setUserDatabase({
        firstName: result.user.displayName || '',
        email: result.user.email || '',
        id: result.user.uid,
      })
    } catch {
      throw Error('Houve algum erro ao tentar iniciar sessão!')
    }
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
      value={{
        user,
        userDatabase,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        setUserDatabase,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
