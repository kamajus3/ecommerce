'use client'

import Header from '@/components/ui/Header'
import ProtectedRoute from '@/components/ui/ProtectedRoute'

import AccountDelete from './accountDelete'
import ContactUpdate from './contactUpdate'
import { PasswordUpdate } from './passwordUpdate'
import PerfilUpdate from './perfilUpdate'

export default function PerfilPage() {
  return (
    <ProtectedRoute
      pathWhenAuthorizated="/"
      pathWhenNotAuthorizated="/login"
      privileges={['client']}
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
