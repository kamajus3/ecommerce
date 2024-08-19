'use client'

import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'

import AccountDelete from './components/AccountDelete'
import ContactUpdate from './components/ContactUpdate'
import { PasswordUpdate } from './components/PasswordUpdate'
import PerfilUpdate from './components/perfilUpdate'

export default function PerfilPage() {
  return (
    <ProtectedRoute
      pathWhenAuthorizated="/"
      pathWhenNotAuthorizated={`/login`}
      role="client"
    >
      <section className="bg-white overflow-hidden">
        <Header.Client />
        <PerfilUpdate />
        <ContactUpdate />
        <PasswordUpdate />
        <AccountDelete />
      </section>
    </ProtectedRoute>
  )
}
