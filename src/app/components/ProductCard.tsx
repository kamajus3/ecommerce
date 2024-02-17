import Image from 'next/image'
import { Product } from '@/@types'
import useCartStore from '@/store/CartStore'
import { XCircle } from 'lucide-react'
import useMoneyFormat from '@/hooks/useMoneyFormat'

export default function ProductCard(product: Product) {
  const money = useMoneyFormat()
  const cartProducts = useCartStore((state) => state.products)
  const removeFromCart = useCartStore((state) => state.removeProduct)

  return (
    <div>
      <div className="w-80 h-80 rounded-md group-hover:opacity-75  max-lg:h-64 max-lg:w-64">
        <div className="w-full h-full relative select-none" draggable={false}>
          <Image
            src={product.photo}
            alt={product.name}
            objectFit="cover"
            objectPosition="center"
            draggable={false}
            className="select-none"
            fill
          />
        </div>
      </div>
      <div className="w-80 max-lg:w-64 mt-4 flex flex-col">
        <div className="w-full flex justify-between">
          <p className="text-sm text-gray-700">
            <a href={`/product/${product.id}`}>{product.name}</a>
          </p>
          <p className="text-sm font-medium text-gray-900">
            {money.format(product.price)}
          </p>
        </div>
        <div className="w-full flex justify-between">
          <p className="mt-1 text-left text-sm text-gray-500">
            {product.category}
          </p>
          {cartProducts.find((p) => p.id === product.id) && (
            <button>
              <XCircle
                color="#000"
                size={20}
                onClick={() => removeFromCart(product.id)}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
