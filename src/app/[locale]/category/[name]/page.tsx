'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

import { IProduct } from '@/@types'
import DataState from '@/components/ui/DataState'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import ProductCard from '@/components/ui/ProductCard'
import { ProductRepository } from '@/repositories/product.repository'

export default function CategorySearchPage() {
  const t = useTranslations('search')

  const { name: categoryValue } = useParams<{ name: string }>()
  const [productData, setProductData] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const category = decodeURIComponent(categoryValue)
  const productRepository = useMemo(() => new ProductRepository(), [])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await productRepository.find({
          filterBy: { category },
        })
        setProductData(products)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, productRepository])

  const resultsCount = productData.length

  return (
    <section className="bg-white min-h-screen">
      <Header.Client />

      <div className="p-4 mt-8">
        <p className="text-[#363b44] font-semibold text-base max-sm:text-center">
          {t('category.label', {
            search: category,
          })}
        </p>

        <p
          className={clsx(
            'text-black font-semibold text-3xl mb-4 max-sm:text-center',
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
          {productData.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </DataState>

      <Footer />
    </section>
  )
}