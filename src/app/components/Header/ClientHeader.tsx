'use client'

import Link from 'next/link'
import { MoveLeft, Search, ShoppingCart } from 'lucide-react'
import HeaderPromo from '@/app/components/Promo/HeaderPromo'
import { useState } from 'react'
import clsx from 'clsx'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useCartStore from '@/store/CartStore'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ClientHeaderProps {
  searchDefault?: string | null
}

const schema = z.object({
  searchValue: z.string().min(1),
})

interface FormData {
  searchValue: string
}

export default function ClientHeader(props: ClientHeaderProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const cartProducts = useCartStore((state) => state.products)
  const [isSearchOn, setSearchOn] = useState(false)
  const router = useRouter()

  function onSubmit(data: FormData) {
    router.replace(`/search/${data.searchValue}`)
  }

  return (
    <header className="border-b">
      <HeaderPromo title="Promoção de verão para todos os trajes de banho e entrega expressa grátis - OFF 50%!" />
      <article
        className={clsx(
          'w-screen flex sm:flex justify-between items-center px-4 py-4',
          {
            hidden: isSearchOn,
          },
        )}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logotipo da Racius Care"
            width={90}
            height={90}
          />
        </Link>

        <div className="flex gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-sm:hidden h-11 w-72 flex justify-between items-center bg-neutral-100"
          >
            <input
              type="text"
              placeholder="Oque é que você precisa?"
              defaultValue={props.searchDefault || ''}
              {...register('searchValue')}
              className={`pl-4 h-full w-[85%] bg-transparent outline-none border-l border-t border-b border-transparent text-black placeholder:text-sm placeholder:text-[#303030] focus:border-main ${errors.searchValue && 'border-red-500'}`}
            ></input>
            <button
              className="bg-main h-full w-[15%] flex items-center justify-center border-main"
              type="submit"
            >
              <Search color="#fff" size={18} />
            </button>
          </form>
          <div className="h-11 flex gap-4 items-center justify-between">
            <button className="hidden max-sm:block">
              <Search
                onClick={() => setSearchOn(true)}
                color="#000"
                size={27}
              />
            </button>
            <Link
              href="/cart"
              className="inline-flex relative justify-center w-full border border-gray-300 shadow-sm p-2 rounded-full bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              <ShoppingCart color="#000" size={27} />
              <div className="absolute bottom-7 left-7 bg-black rounded-full flex justify-center items-center w-6 h-6">
                <span
                  className={clsx(
                    'text-white text-[12px] text-center font-semibold',
                    {
                      hidden: cartProducts.length >= 10,
                    },
                  )}
                >
                  {cartProducts.length}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </article>

      <article
        className={clsx('items-center justify-around flex sm:hidden', {
          hidden: !isSearchOn,
        })}
      >
        <button
          className="h-full w-[10%] flex items-center justify-center"
          onClick={() => setSearchOn(false)}
        >
          <MoveLeft color="#000" size={20} />
        </button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-between items-center m-auto h-11 my-4 w-[80%] bg-neutral-100 border-b"
        >
          <input
            type="text"
            placeholder="Oque é que você precisa?"
            defaultValue={props.searchDefault || ''}
            {...register('searchValue')}
            className={`pl-4 h-full w-[85%] bg-transparent outline-none border-l border-t border-b border-transparent text-black placeholder:text-sm placeholder:text-[#303030] focus:border-main ${errors.searchValue && 'border-red-500'}`}
          ></input>
          <button
            type="submit"
            className="bg-main h-full w-[15%] flex items-center justify-center border-main"
          >
            <Search color="#fff" size={18} />
          </button>
        </form>
      </article>
    </header>
  )
}
