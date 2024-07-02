'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { MoveLeft, Search, ShoppingCart } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { useAuth } from '@/hooks/useAuth'
import { getProduct } from '@/lib/firebase/database'
import useCartStore from '@/store/CartStore'
import { zodResolver } from '@hookform/resolvers/zod'

import Avatar from '../Avatar'
import Button from '../Button'

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
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const { userDB } = useAuth()
  const isAdmin = userDB && userDB.role && userDB.role === 'admin'
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
    <header className="bg-white border-b w-full shadow-sm sticky top-0 left-0 z-20">
      <article className="w-[98%] flex justify-between items-center py-4 px-6 mx-auto">
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
            'h-full w-[10%] flex items-center justify-center sm:hidden p-2',
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
              'max-sm:flex max-sm:w-[70vw] h-11 w-72 flex justify-between items-center bg-[#eaeaea] rounded-l-md',
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
              className="pl-4 h-full w-[85%] rounded-l-md bg-transparent outline-none border-l border-t border-b border-transparent text-black placeholder:text-sm placeholder:text-[#303030] focus:border-main"
            ></input>
            <button
              className="bg-main h-full w-[15%] flex items-center justify-center border-main rounded-r-md"
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
              onClick={() => setSearchOn(true)}
            >
              <Search color="#000" size={27} />
            </button>

            <Link
              href="/carrinho"
              className={clsx(
                'inline-flex relative justify-center w-11 h-11 border border-gray-300 shadow-sm p-2 rounded-full bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100',
                {
                  hidden: isAdmin,
                },
              )}
            >
              <ShoppingCart color="#000" size={27} />

              {/* Products count in the cart indicator */}
              <div
                className={clsx(
                  'absolute bottom-7 left-7 bg-secondary rounded-full flex justify-center items-center w-6 h-6',
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

            <div>
              {isAdmin ? (
                <Link href="/admin">
                  <Button className="h-11">Voltar ao back-office</Button>
                </Link>
              ) : (
                <Avatar.Root>
                  <Avatar.Client />
                </Avatar.Root>
              )}
            </div>
          </div>
        </div>
      </article>
    </header>
  )
}
