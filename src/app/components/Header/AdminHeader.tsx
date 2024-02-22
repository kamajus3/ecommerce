import Avatar from '@/app/components/Avatar'
import Link from 'next/link'

export default function AdminHeader() {
  return (
    <header className="border-b">
      <article className="w-screen flex sm:flex justify-between items-center px-4 py-4">
        <h1 className="text-black font-bold text-2xl">Racius Care</h1>

        <div className="flex gap-4 items-center mr-4">
          <Link
            href="/admin/analytics"
            className="font-medium text-black max-sm:hidden"
          >
            Analytics
          </Link>
          <Link
            href="/admin/sells"
            className="font-medium text-black max-sm:hidden"
          >
            Vendas
          </Link>
          <Link
            href="/admin/products"
            className="font-medium text-black max-sm:hidden"
          >
            Productos
          </Link>
          <div className="h-11 flex gap-4 items-center justify-between">
            <Avatar />
          </div>
        </div>
      </article>
    </header>
  )
}
