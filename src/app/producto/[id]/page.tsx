import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import clsx from 'clsx'

import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import ProductList from '@/components/ui/ProductList'
import { campaignValidator } from '@/functions'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { getProduct } from '@/lib/firebase/database'

import PostAction from './action'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  return new Promise((resolve) => {
    getProduct(params.id).then((data) => {
      if (data) {
        resolve({
          title: data.name,
          description:
            data.description.length <= 100
              ? data.description
              : `${data.description.slice(0, 100)}...`,
          openGraph: {
            type: 'article',
            title: data.name,
            description: data.description,
            siteName: 'Racius Care',
            images: data.photo,
          },
        })
      } else {
        resolve({
          title: 'Produto não encontrado.',
        })
      }
    })
  })
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)
  if (!product) notFound()
  const money = useMoneyFormat()

  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <div className="container mx-auto py-8 flex items-center justify-center flex-wrap">
        <div className="bg-white p-8 rounded-lg flex items-center justify-center flex-wrap gap-x-16">
          <div
            className="w-full sm:w-80 h-80 relative select-none"
            draggable={false}
          >
            {product && (
              <div>
                {product.campaign &&
                  campaignValidator(product.campaign) ===
                    'campaign-with-promotion' && (
                    <Link
                      href={`/campanha/${product.campaign?.id}`}
                      className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-red-500 text-white z-50 left-0 top-0"
                    >
                      Promoção de {`${product.campaign?.reduction} %`}
                    </Link>
                  )}

                {product.campaign &&
                  campaignValidator(product.campaign) === 'campaign' && (
                    <Link
                      href={`/campanha/${product.campaign?.id}`}
                      className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-green-500 text-white z-50 left-0 top-0"
                    >
                      Em campanha
                    </Link>
                  )}

                <Image
                  src={product.photo}
                  alt={product.name}
                  draggable={false}
                  className="select-none object-cover object-center"
                  fill
                />
              </div>
            )}
          </div>
          <div className="mt-4 sm:w-80 w-full flex flex-col items-start justify-center">
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
            <Link
              href={`/categoria/${product.category}`}
              className="text-gray-600 font-medium"
            >
              {product.category}
            </Link>
            <h2 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.description}</p>

            <span className="block mt-2 text-xl font-semibold text-gray-700">
              {product.campaign &&
              product.campaign.reduction &&
              campaignValidator(product.campaign) === 'campaign-with-promotion'
                ? money.format(
                    product.price -
                      product.price *
                        (Number(product.campaign.reduction) / 100),
                  )
                : money.format(product.price)}
            </span>
            {product.campaign &&
              campaignValidator(product.campaign) ===
                'campaign-with-promotion' && (
                <span className="font-medium line-through text-gray-500 text-sm">
                  {money.format(product.price)}
                </span>
              )}
            <PostAction {...product} id={params.id} />
          </div>
        </div>
      </div>
      <ProductList
        title="Produtos relacionados"
        query={{
          category: product.category,
          except: params.id,
          limit: 15,
        }}
      />
      <div className="mb-4" />
      <Footer disableBackButton />
    </section>
  )
}
