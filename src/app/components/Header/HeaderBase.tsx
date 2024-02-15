import Link from 'next/link'
import { Search, ShoppingCart, User } from 'lucide-react'

export default function Base() {
  return (
    <header className="w-screen flex justify-around items-center py-4 border-b">
      <Link href="/">
        <h1 className="text-black font-bold text-2xl">Racius Care</h1>
      </Link>

      <div className="flex gap-4">
        <div className="max-sm:hidden h-11 w-72 flex justify-between items-center bg-input">
          <input
            type="text"
            placeholder="Oque é que você precisa?"
            className="pl-4 h-full w-[85%] bg-transparent outline-none border-l border-t border-b border-transparent text-black placeholder:text-sm placeholder:text-[#303030] focus:border-main"
          ></input>
          <button className="bg-main h-full w-[15%] flex items-center justify-center">
            <Search color="#fff" size={18} />
          </button>
        </div>
        <div className="h-11 flex items-center gap-8 justify-between">
          <button className="hidden max-sm:block">
            <Search color="#000" size={27} />
          </button>
          <button>
            <ShoppingCart color="#000" size={27} />
          </button>
          <button>
            <User color="#000" size={27} />
          </button>
        </div>
      </div>
    </header>
  )
}
