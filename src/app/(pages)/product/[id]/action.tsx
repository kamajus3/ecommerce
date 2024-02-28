'use client'

import useCartStore from '@/store/CartStore'
import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { ProductItem } from '@/@types'

export default function PostAction(product: ProductItem) {
  const [quantity, setQuantity] = useState(1)
  const cartProducts = useCartStore((state) => state.products)

  const AddToCart = useCartStore((state) => state.addProduct)
  const removeFromCart = useCartStore((state) => state.removeProduct)

  const increaseQuantity = () => {
    setQuantity((quantity) => quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((quantity) => quantity - 1)
    }
  }

  return (
    <>
      <div className="flex mt-4">
        <button className="bg-red-500 h-12 w-12" onClick={decreaseQuantity}>
          -
        </button>
        <input
          className="w-16 h-12 text-center bg-gray-100 text-black outline-none border-b border-t"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button className="bg-red-500 h-12 w-12" onClick={increaseQuantity}>
          +
        </button>
      </div>
      {cartProducts.find((p) => p.id === product?.id) ? (
        <button
          onClick={() => {
            if (product?.id) {
              removeFromCart(product?.id)
              setQuantity(1)
            }
          }}
          className="mt-4 bg-red-500 text-white p-4 hover:brightness-90 focus:outline-none font-medium active:scale-75 flex items-center justify-center gap-2"
        >
          <Minus size={15} /> Remover do carrinho
        </button>
      ) : (
        <button
          onClick={() => {
            if (product?.id) {
              AddToCart({
                ...product,
                quantity,
              })
            }
          }}
          className="mt-4 bg-main text-white p-4 hover:brightness-90 focus:outline-none font-medium active:scale-75 flex items-center justify-center gap-2"
        >
          <Plus size={15} /> Adicionar ao carrinho
        </button>
      )}
    </>
  )
}