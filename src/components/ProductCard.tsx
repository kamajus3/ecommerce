'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { X } from 'lucide-react'

import { IProduct } from '@/@types'
import { campaignValidator } from '@/functions'
import { formatMoney, formatPhotoUrl } from '@/functions/format'
import { Link } from '@/navigation'
import useCartStore from '@/store/CartStore'
import useUserStore from '@/store/UserStore'

export default function ProductCard(product: IProduct) {
  const t = useTranslations('product')

  const cartProducts = useCartStore((state) => state.products)
  const removeFromCart = useCartStore((state) => state.removeProduct)
  const userDB = useUserStore((state) => state.data)
  const userIsAdmin = userDB ? userDB.role === 'admin' : false

  const isProductInCart = cartProducts.some((p) => p.id === product.id)

  return (
    <div className="flex-shrink-0 grow-0 overflow-hidden mx-auto">
      <div className="w-72 h-72 rounded-md relative">
        <div className="w-full h-full relative select-none" draggable={false}>
          {isProductInCart && !userIsAdmin && (
            <button
              onClick={() => removeFromCart(product.id)}
              className="absolute h-10 w-10 flex items-center justify-center bg-secondary hover:brightness-90 active:brightness-75 z-10"
            >
              <X size={20} color="#fff" />
            </button>
          )}

          {product?.campaign &&
            campaignValidator(product.campaign) === 'promotional-campaign' && (
              <Link
                href={`/campaign/${product.campaign?.id}`}
                className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-red-500 text-white z-10 left-0 -bottom-1 cursor-pointer"
              >
                {t('promo')}: {product.campaign.reduction}%
              </Link>
            )}

          {product.campaign &&
            campaignValidator(product.campaign) === 'campaign' && (
              <Link
                href={`/campaign/${product.campaign?.id}`}
                className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-green-500 text-white z-10 left-0 -bottom-1 cursor-pointer"
              >
                {t('onCampaign')}
              </Link>
            )}

          <Link href={`/product/${product.id}`}>
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
      <div className="w-full mt-4 flex flex-col">
        <div className="w-full flex items-center gap-x-2">
          <p className="text-lg font-semibold text-gray-900">
            {product?.campaign &&
            campaignValidator(product.campaign) === 'promotional-campaign'
              ? formatMoney(
                  product.price -
                    product.price * (Number(product.campaign.reduction) / 100),
                )
              : formatMoney(product.price)}
          </p>

          {product?.campaign &&
            campaignValidator(product.campaign) === 'promotional-campaign' && (
              <p className="font-medium line-through text-gray-500 text-sm">
                {formatMoney(product.price)}
              </p>
            )}
        </div>
        <span className="w-72 text-left text-base text-gray-700 font-medium">
          {product.name}
        </span>
        <div
          className={clsx(
            'w-full flex items-center justify-start cursor-default',
            {
              hidden: product.quantity > 5,
            },
          )}
        >
          <span
            className={clsx(
              'inline-block p-2 rounded-md text-xs font-semibold',
              {
                'bg-gray-500': product.quantity === 0,
                'text-white': product.quantity === 0,
                'bg-red-500': product.quantity > 0,
                'text-gray-100': product.quantity > 0,
              },
            )}
          >
            {product.quantity > 0
              ? t('stock.inStock', {
                  quantity: product.quantity,
                })
              : t('stock.outOfStock')}
          </span>
        </div>
      </div>
    </div>
  )
}
