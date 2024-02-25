import Avatar from '@/app/components/Avatar'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminHeader() {
  return (
    <header className="border-b">
      <article className="w-screen flex sm:flex justify-between items-center px-4 py-4">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logotipo da Racius Care"
            width={90}
            height={90}
          />
        </Link>

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
