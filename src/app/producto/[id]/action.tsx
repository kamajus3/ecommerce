'use client'

import { useEffect, useState } from 'react'

import { IProduct } from '@/@types'
import Button from '@/components/ui/Button'
import useCartStore from '@/store/CartStore'
import useUserStore from '@/store/UserStore'
import useViewStore from '@/store/ViewStore'

export default function PostAction(product: IProduct) {
  const [quantity, setQuantity] = useState(1)
  const viewProduct = useViewStore((state) => state.viewProduct)

  const cartProducts = useCartStore((state) => state.products)
  const AddToCart = useCartStore((state) => state.addProduct)
  const removeFromCart = useCartStore((state) => state.removeProduct)

  const IsproductInCart = !!cartProducts.find((p) => p.id === product?.id)

  const userDB = useUserStore((state) => state.data)
  const userIsAdmin = userDB ? userDB.role === 'admin' : false

  const increaseQuantity = () => {
    setQuantity((quantity) => quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((quantity) => quantity - 1)
    }
  }

  useEffect(() => {
    viewProduct(product.id)
  }, [viewProduct, product.id])

  return (
    <div>
      <div className="flex mt-4">
        <Button
          className="rounded-none rounded-l-md px-4"
          onClick={decreaseQuantity}
          disabled={userIsAdmin || IsproductInCart || quantity === 1}
        >
          -
        </Button>
        <input
          className="w-10 px-3 py-2 text-center bg-gray-100 disabled:text-disabledText text-black font-medium outline-none border-b border-t"
          type="number"
          value={quantity}
          max={product.quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          disabled={userIsAdmin || IsproductInCart || product.quantity === 0}
        />
        <Button
          className="rounded-none rounded-r-md px-4"
          onClick={increaseQuantity}
          disabled={
            userIsAdmin ||
            IsproductInCart ||
            product.quantity === 0 ||
            quantity === product.quantity
          }
        >
          +
        </Button>
      </div>
      {IsproductInCart && !userIsAdmin ? (
        <Button
          onClick={() => {
            if (product?.id) {
              removeFromCart(product?.id)
              setQuantity(1)
            }
          }}
          className="h-12 mt-4 bg-red-500"
          disabled={userIsAdmin || product.quantity === 0}
        >
          Remover do carrinho
        </Button>
      ) : (
        <Button
          onClick={() => {
            if (product?.id) {
              AddToCart({
                ...product,
                quantity,
              })
            }
          }}
          className="h-12 mt-4 bg-secondary"
          disabled={userIsAdmin || product.quantity === 0}
        >
          Adicionar ao carrinho
        </Button>
      )}
    </div>
  )
}
