import { redirect } from 'next/navigation'

export async function Admin() {
  redirect(`/admin/dashboard`)
}
