'use client'

import Image from 'next/image'
import { ShareIcon } from 'lucide-react'
import { RWebShare } from 'react-web-share'

import { IProduct } from '@/@types'
import Button from '@/components/Button'
import { env } from '@/env'
import { campaignValidator } from '@/functions'
import { formatPhotoUrl } from '@/functions/format'
import { Link, usePathname } from '@/navigation'

export default function ProductPhoto(product: IProduct) {
  const pathname = usePathname()

  return (
    <div>
      {product.campaign &&
        campaignValidator(product.campaign) === 'promotional-campaign' && (
          <Link
            href={`/campaign/${product.campaign?.id}`}
            className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-red-500 text-white z-50 left-0 top-0"
          >
            Promoção de {`${product.campaign?.reduction} %`}
          </Link>
        )}

      {product.campaign &&
        campaignValidator(product.campaign) === 'campaign' && (
          <Link
            href={`/campaign/${product.campaign?.id}`}
            className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-green-500 text-white z-50 left-0 top-0"
          >
            Em campanha
          </Link>
        )}

      <RWebShare
        data={{
          url: `${env.NEXT_PUBLIC_WEBSITE_URL}${pathname}`,
          title: product.name,
        }}
      >
        <Button className="absolute z-50 right-0 top-0 rounded-full p-2 bg-black text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <ShareIcon color="#fff" size={27} />
        </Button>
      </RWebShare>

      <Image
        src={formatPhotoUrl(product.photo, product.updatedAt)}
        alt={product.name}
        draggable={false}
        className="select-none object-cover object-center"
        fill
      />
    </div>
  )
}
