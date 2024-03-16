'use client'

import Header from '@/app/components/Header'
import { PasswordUpdate } from './passwordUpdate'
import PerfilUpdate from './perfilUpdate'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import AccountDelete from './accountDelete'

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
