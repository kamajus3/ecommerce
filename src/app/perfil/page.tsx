'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Header from '@/components/ui/Header'

import AccountDelete from './accountDelete'
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
        <PasswordUpdate />
        <AccountDelete />
      </section>
    </ProtectedRoute>
  )
}
