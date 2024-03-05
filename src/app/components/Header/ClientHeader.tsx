'use client'

import Link from 'next/link'
import { MoveLeft, Search, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useCartStore from '@/store/CartStore'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getProduct } from '@/lib/firebase/database'

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
  const removeFromCart = useCartStore((state) => state.removeProduct)
  const [isSearchOn, setSearchOn] = useState(false)
  const router = useRouter()

  function onSubmit(data: FormData) {
    router.replace(`/pesquisa/${data.searchValue}`)
  }

  useEffect(() => {
    function unsubscribed() {
      cartProducts.map(async (p) => {
        const data = await getProduct(p.id)
        if (!data) {
          removeFromCart(p.id)
        }
      })
    }

    unsubscribed()
  }, [cartProducts, removeFromCart])

  return (
    <header className="border-b sticky top-0 z-50 w-full shadow-sm lg:static lg:z-auto">
      <article className="w-[98%] flex justify-between items-center py-3 mx-auto">
        <Link href="/" style={{ display: isSearchOn ? 'none' : 'inline' }}>
          <Image
            src="/logo.png"
            alt="Logotipo da Racius Care"
            width={90}
            height={90}
          />
        </Link>

        <button
          className={clsx(
            'h-full w-[10%] flex items-center justify-center sm:hidden',
            {
              hidden: !isSearchOn,
            },
          )}
          onClick={() => setSearchOn(false)}
        >
          <MoveLeft color="#000" size={20} />
        </button>

        <div className="flex gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={clsx(
              'max-sm:flex max-sm:w-[80vw] h-11 w-72 flex justify-between items-center bg-neutral-100',
              {
                'max-sm:hidden': !isSearchOn,
              },
            )}
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
          <div
            className={clsx('h-11 flex gap-4 items-center justify-between', {
              hidden: isSearchOn,
            })}
          >
            <button 
              className="hidden max-sm:block"
              onClick={() => setSearchOn(true)}>
              <Search
                color="#000"
                size={27}
              />
            </button>
            <Link
              href="/carrinho"
              className="inline-flex relative justify-center w-full border border-gray-300 shadow-sm p-2 rounded-full bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              <ShoppingCart color="#000" size={27} />
              <div
                className={clsx(
                  'absolute bottom-7 left-7 bg-main rounded-full flex justify-center items-center w-6 h-6',
                  {
                    hidden: cartProducts.length === 0,
                  },
                )}
              >
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
    </header>
  )
}
