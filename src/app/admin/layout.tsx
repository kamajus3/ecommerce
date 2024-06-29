import ProtectedRoute from '@/components/ui/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
