import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute
      pathWhenAuthorizated="/admin/dashboard"
      pathWhenNotAuthorizated="/admin/login"
    >
      {children}
    </ProtectedRoute>
  )
}
