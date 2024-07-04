import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { X } from 'lucide-react'

import { IProduct } from '@/@types'
import { campaignValidator, formatPhotoUrl } from '@/functions'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import useCartStore from '@/store/CartStore'
import useUserStore from '@/store/UserStore'

export default function ProductCard(product: IProduct) {
  const money = useMoneyFormat()
  const cartProducts = useCartStore((state) => state.products)
  const removeFromCart = useCartStore((state) => state.removeProduct)

  const userDB = useUserStore((state) => state.data)
  const userIsAdmin = userDB ? userDB.role === 'admin' : false

  return (
    <div className="flex-shrink-0 grow-0 overflow-hidden mx-auto">
      <div className="w-72 h-72 rounded-md">
        <div className="w-full h-full relative select-none" draggable={false}>
          {cartProducts.find((p) => p.id === product.id) && !userIsAdmin && (
            <button
              onClick={() => removeFromCart(product.id)}
              className="absolute h-10 w-10 flex items-center justify-center bg-secondary hover:brightness-90 active:brightness-75 z-10"
            >
              <X size={20} color="#fff" />
            </button>
          )}

          {product.campaign &&
            campaignValidator(product.campaign) ===
              'campaign-with-promotion' && (
              <Link
                href={`/campanha/${product.campaign?.id}`}
                className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-red-500 text-white z-10 left-0 -bottom-1 cursor-pointer"
              >
                Promoção: {`${product.campaign.reduction} %`}
              </Link>
            )}

          {product.campaign &&
            campaignValidator(product.campaign) === 'campaign' && (
              <Link
                href={`/campanha/${product.campaign?.id}`}
                className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-green-500 text-white z-10 left-0 -bottom-1 cursor-pointer"
              >
                Em campanha
              </Link>
            )}

          <Link href={`/producto/${product.id}`}>
            <Image
              src={formatPhotoUrl(product.photo, product.updatedAt)}
              alt={product.name}
              draggable={false}
              className="select-none object-cover object-center"
              fill
            />
          </Link>
        </div>
      </div>
      <div className="w-full mt-4 flex flex-wrap flex-col">
        <div className="w-full flex items-center gap-x-2">
          <p className="text-lg font-semibold text-gray-900">
            {product.campaign &&
            product.campaign.reduction &&
            campaignValidator(product.campaign) === 'campaign-with-promotion'
              ? money.format(
                  product.price -
                    product.price * (Number(product.campaign.reduction) / 100),
                )
              : money.format(product.price)}
          </p>

          {product.campaign &&
            campaignValidator(product.campaign) ===
              'campaign-with-promotion' && (
              <p className="font-medium line-through text-gray-500 text-sm">
                {money.format(product.price)}
              </p>
            )}
        </div>
        <span className="w-72 text-base text-left text-gray-700 font-medium">
          {product.name}
        </span>
        <div
          className={clsx('w-full flex items-center justify-start', {
            hidden: product.quantity > 5,
          })}
        >
          <span
            className={clsx(
              'inline-block p-2 rounded-md bg-gray-500 text-white text-xs font-semibold',
              {
                'bg-red-500': product.quantity !== 0,
              },
            )}
          >
            {product.quantity > 0
              ? `Apenas ${product.quantity} em estoque`
              : 'Esgotado'}
          </span>
        </div>
      </div>
    </div>
  )
}
