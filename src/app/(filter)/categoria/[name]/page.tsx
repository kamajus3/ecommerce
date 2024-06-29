'use client'

import Header from '@/components/ui/Header'
import ProductCard from '@/components/ui/ProductCard'
import Footer from '@/components/ui/Footer'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProductItem } from '@/@types'
import { getProducts } from '@/lib/firebase/database'
import clsx from 'clsx'
import DataState from '@/components/ui/DataState'

export default function CategorySearchPage() {
  const [productData, setProductData] = useState<Record<string, ProductItem>>(
    {},
  )
  const [loading, setLoading] = useState(true)
  const { name: categoryValue } = useParams<{ name: string }>()
  const category = decodeURIComponent(categoryValue)

  useEffect(() => {
    async function unsubscribed() {
      await getProducts({
        category,
      }).then((products) => {
        setProductData(products)
      })
      setLoading(false)
    }

    unsubscribed()
  }, [category])

  const resultsCount = Object.keys(productData).length

  return (
    <section className="bg-white min-h-screen">
      <Header.Client />

      <div>
        <p className="text-[#363b44] font-semibold text-base p-4 mt-8 max-sm:text-center">
          PRODUCTOS DA CATEGÓRIA &quot;{category}&quot;
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
            ? `Foram encontrados ${resultsCount} resultado(s).`
            : `Mais de ${resultsCount} resultados encontrados`}
        </p>
      </div>

      <DataState
        dataCount={resultsCount}
        loading={loading}
        noDataMessage="Nenhum resultado foi encontrado"
      >
        <div
          className={clsx(
            'w-screen min-h-[120vh] flex flex-wrap gap-9 p-6 justify-center mb-8 max-w-[98vw]',
            {
              hidden: resultsCount === 0,
            },
          )}
        >
          {Object.entries(productData).map(([id, product]) => (
            <ProductCard key={id} {...product} id={id} />
          ))}
        </div>
      </DataState>

      <Footer />
    </section>
  )
}
