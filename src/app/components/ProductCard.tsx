import Image from 'next/image'
import { ProductItem } from '@/@types'
import useCartStore from '@/store/CartStore'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProductCard(product: ProductItem) {
  const money = useMoneyFormat()
  const cartProducts = useCartStore((state) => state.products)
  const removeFromCart = useCartStore((state) => state.removeProduct)
  const router = useRouter()

  return (
    <div>
      <div className="w-80 h-80 rounded-md group-hover:opacity-75  max-lg:h-64 max-lg:w-64">
        <div className="w-full h-full relative select-none" draggable={false}>
          {cartProducts.find((p) => p.id === product.id) && (
            <button
              onClick={() => removeFromCart(product.id)}
              className="absolute h-10 w-10 flex items-center justify-center bg-red-500 hover:brightness-90 active:brightness-75 z-50"
            >
              <X size={20} color="#000" />
            </button>
          )}

          {product.promotion?.reduction &&
            product.promotion?.reduction !== 0 && (
              <span
                onClick={() => {
                  router.push(
                    `/search/promotion?promotionId=${product.promotion?.id}`,
                  )
                }}
                className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-red-500 text-white z-50 left-0 -bottom-1"
              >
                Promoção: {`${product.promotion.reduction} %`}
              </span>
            )}

          {product.promotion?.reduction &&
            product.promotion?.reduction === 0 && (
              <span
                onClick={() => {
                  router.push(
                    `/search/promotion?promotionId=${product.promotion?.id}`,
                  )
                }}
                className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-green-500 text-white z-50 left-0 -bottom-1"
              >
                Em campanha
              </span>
            )}

          <Link href={`/product/${product.id}`}>
            <Image
              src={product.photo}
              alt={product.name}
              objectFit="cover"
              objectPosition="center"
              draggable={false}
              className="select-none"
              fill
            />
          </Link>
        </div>
      </div>
      <div className="w-80 max-lg:w-64 mt-4 flex flex-wrap flex-col">
        <div className="w-full flex items-center gap-x-2">
          <p className="text-lg font-semibold text-gray-900">
            {product.promotion?.reduction && product.promotion?.reduction !== 0
              ? money.format(
                  product.price -
                    product.price * (product.promotion.reduction / 100),
                )
              : money.format(product.price)}
          </p>

          {product.promotion?.reduction &&
            product.promotion?.reduction !== 0 && (
              <p className="font-medium line-through text-gray-500 text-sm">
                {money.format(product.price)}
              </p>
            )}
        </div>
        <div className="w-full flex justify-between items-center">
          <p className="text-base text-gray-700 font-medium">
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
