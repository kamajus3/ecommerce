import { useTranslations } from 'next-intl'
import clsx from 'clsx'

import { IProduct } from '@/@types'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProductList from '@/components/ProductList'
import { campaignValidator } from '@/functions'
import { formatMoney } from '@/functions/format'
import { Link } from '@/navigation'

import ProductAction from './ProductAction'
import ProductPhoto from './ProductPhoto'

export default function Product(product: IProduct) {
  const t = useTranslations()

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
                  ? t('product.stock.inStock', {
                      quantity: product.quantity,
                    })
                  : t('product.stock.outOfStock')}
              </span>
            </div>
            <Link
              href={`/category/${product.category}`}
              className="text-gray-600 font-medium"
            >
              {t(`categories.labels.${product.category}`)}
            </Link>
            <h2 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.description}</p>

            <span className="block mt-2 text-xl font-semibold text-gray-700">
              {product.campaign &&
              product.campaign.reduction &&
              campaignValidator(product.campaign) === 'promotional-campaign'
                ? formatMoney(
                    product.price -
                      product.price *
                        (Number(product.campaign.reduction) / 100),
                  )
                : formatMoney(product.price)}
            </span>

            {product.campaign &&
              campaignValidator(product.campaign) ===
                'promotional-campaign' && (
                <span className="font-medium line-through text-gray-500 text-sm">
                  {formatMoney(product.price)}
                </span>
              )}
            <ProductAction {...product} />
          </div>
        </div>
      </div>
      <ProductList
        title={t('product.relatedProduct')}
        query={{
          filterBy: {
            category: product.category,
          },
          exceptionId: product.id,
          limit: 15,
        }}
      />
      <div className="mb-4" />
      <Footer />
    </section>
  )
}
