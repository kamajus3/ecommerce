'use client'

import Link from 'next/link'
import { MoveLeft, Search, ShoppingCart, User } from 'lucide-react'
import HeaderPromo from './HeaderPromo'
import { useState } from 'react'
import clsx from 'clsx'

export default function Base() {
  const [isSearchOn, setSearchOn] = useState(false)

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
          <h1 className="text-black font-bold text-2xl">Racius Care</h1>
        </Link>

        <div className="flex gap-4">
          <div className="max-sm:hidden h-11 w-72 flex justify-between items-center bg-neutral-100">
            <input
              type="text"
              placeholder="Oque é que você precisa?"
              className="pl-4 h-full w-[85%] bg-transparent outline-none border-l border-t border-b border-transparent text-black placeholder:text-sm placeholder:text-[#303030] focus:border-main"
            ></input>
            <button className="bg-main h-full w-[15%] flex items-center justify-center border-main">
              <Search color="#fff" size={18} />
            </button>
          </div>
          <div className="h-11 flex gap-4 items-center justify-between">
            <button className="hidden max-sm:block">
              <Search
                onClick={() => setSearchOn(true)}
                color="#000"
                size={27}
              />
            </button>
            <button>
              <ShoppingCart color="#000" size={27} />
            </button>
            <button className="bg-red-500 p-2 rounded-full">
              <User color="#fff" size={27} />
            </button>
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

        <div
          className={
            'flex justify-between items-center m-auto h-11 my-4 w-[80%] bg-neutral-100 border-b'
          }
        >
          <input
            type="text"
            placeholder="Oque é que você precisa?"
            className="pl-4 h-full w-[85%] bg-transparent outline-none border-l border-t border-b border-transparent text-black placeholder:text-sm placeholder:text-[#303030] focus:border-main"
          ></input>
          <button className="bg-main h-full w-[15%] flex items-center justify-center border-main">
            <Search color="#fff" size={18} />
          </button>
        </div>
      </article>
    </header>
  )
}
