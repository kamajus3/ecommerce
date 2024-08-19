'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

import { IProduct } from '@/@types'
import DataState from '@/components/DataState'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { ProductRepository } from '@/repositories/product.repository'

export default function SearchPage() {
  const t = useTranslations('search')

  const [productData, setProductData] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { value: searchValue } = useParams<{ value: string }>()
  const search = decodeURIComponent(searchValue)

  const productRepository = useMemo(() => new ProductRepository(), [])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await productRepository.findByName({ search })
        setProductData(products)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [productRepository, search])

  const resultsCount = productData.length

  return (
    <section className="bg-white min-h-screen">
      <Header.Client searchDefault={search} />

      <div>
        <p className="text-[#363b44] font-semibold text-base p-4 mt-8 max-sm:text-center">
          {t('products.label', {
            search,
          })}
        </p>

        <p
          className={clsx(
            'text-black font-semibold text-3xl p-4 mb-4 max-sm:text-center',
            {
              hidden: resultsCount === 0,
            },
          )}
        >
          {resultsCount < 100
            ? t('foundCount', {
                resultsCount,
              })
            : t('foundMoreThanCount', {
                resultsCount,
              })}
        </p>
      </div>

      <DataState
        dataCount={resultsCount}
        loading={loading}
        noDataMessage={t('notFound')}
      >
        <div
          className={clsx(
            'w-screen min-h-[120vh] flex flex-wrap gap-9 p-6 justify-center mb-8 max-w-[98vw]',
            {
              hidden: resultsCount === 0,
            },
          )}
        >
          {productData.length > 0 &&
            productData.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
        </div>
      </DataState>
      <Footer />
    </section>
  )
}
