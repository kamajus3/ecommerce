import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import clsx from 'clsx'

import ProductAction from '@/app/producto/components/ProductAction'
import ProductPhoto from '@/app/producto/components/ProductPhoto'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import ProductList from '@/components/ui/ProductList'
import { campaignValidator, formatMoney, formatPhotoUrl } from '@/functions'
import { getProduct } from '@/services/firebase/database'

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string }
}): Promise<Metadata> {
  return new Promise((resolve) => {
    getProduct(id).then((data) => {
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
            images: formatPhotoUrl(data.photo, data.updatedAt),
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
  params: { id },
}: {
  params: { id: string }
}) {
  const product = await getProduct(id)

  if (!product) notFound()
  else product.id = id

  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <div className="container mx-auto py-8 flex items-center justify-center flex-wrap">
        <div className="bg-white p-8 rounded-lg flex items-center justify-center flex-wrap gap-x-16">
          <div
            className="w-full sm:w-80 h-80 relative select-none"
            draggable={false}
          >
            {product && <ProductPhoto {...product} />}
          </div>
          <div className="mt-4 sm:w-80 w-full flex flex-col items-start justify-center">
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
                ? formatMoney(
                    product.price -
                      product.price *
                        (Number(product.campaign.reduction) / 100),
                  )
                : formatMoney(product.price)}
            </span>
            {product.campaign &&
              campaignValidator(product.campaign) ===
                'campaign-with-promotion' && (
                <span className="font-medium line-through text-gray-500 text-sm">
                  {formatMoney(product.price)}
                </span>
              )}
            <ProductAction {...product} />
          </div>
        </div>
      </div>
      <ProductList
        title="Produtos relacionados"
        query={{
          category: product.category,
          exceptProductId: id,
          limit: 15,
        }}
      />
      <div className="mb-4" />
      <Footer disableBackButton />
    </section>
  )
}
