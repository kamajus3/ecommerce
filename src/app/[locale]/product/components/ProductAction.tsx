'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { IProduct } from '@/@types'
import Button from '@/components/ui/Button'
import useCartStore from '@/store/CartStore'
import useUserStore from '@/store/UserStore'
import useViewStore from '@/store/ViewStore'

export default function ProductAction(product: IProduct) {
  const t = useTranslations()

  const [quantity, setQuantity] = useState(1)
  const viewProduct = useViewStore((state) => state.viewProduct)

  const cartProducts = useCartStore((state) => state.products)
  const addToCart = useCartStore((state) => state.addProduct)
  const removeFromCart = useCartStore((state) => state.removeProduct)

  const isProductInCart = !!cartProducts.find((p) => p.id === product.id)

  const userDB = useUserStore((state) => state.data)
  const userIsAdmin = userDB?.role === 'admin'

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1)
    }
  }

  useEffect(() => {
    if (userDB?.role === 'client') {
      viewProduct(product.id, userDB.id)
    }
  }, [viewProduct, product.id, userDB])

  return (
    <div>
      <div className="flex mt-4">
        <Button
          className="rounded-none rounded-l-md px-4"
          onClick={decreaseQuantity}
          disabled={userIsAdmin || isProductInCart || quantity === 1}
        >
          -
        </Button>
        <input
          className="w-10 px-3 py-2 text-center bg-gray-100 disabled:text-disabledText text-black font-medium outline-none border-b border-t"
          type="number"
          value={quantity}
          max={product.quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          disabled={userIsAdmin || isProductInCart || product.quantity === 0}
        />
        <Button
          className="rounded-none rounded-r-md px-4"
          onClick={increaseQuantity}
          disabled={
            userIsAdmin ||
            isProductInCart ||
            product.quantity === 0 ||
            quantity === product.quantity
          }
        >
          +
        </Button>
      </div>
      {isProductInCart && !userIsAdmin ? (
        <Button
          onClick={() => {
            if (product.id) {
              removeFromCart(product.id)
              setQuantity(1)
            }
          }}
          className="h-12 mt-4 bg-red-500"
          disabled={userIsAdmin || product.quantity === 0}
        >
          {t('product.button-remove-product')}
        </Button>
      ) : (
        <Button
          onClick={() => {
            if (product.id) {
              addToCart({
                ...product,
                quantity,
              })
            }
          }}
          className="h-12 mt-4 bg-secondary"
          disabled={userIsAdmin || product.quantity === 0}
        >
          {t('product.button-add-product')}
        </Button>
      )}
    </div>
  )
}
