'use client'

import Header from '@/app/components/Header'
import ProductCard from '@/app/components/ProductCard'
import Footer from '@/app/components/Footer'
import { useParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { ProductItem } from '@/@types'
import { getProducts } from '@/lib/firebase/database'
import clsx from 'clsx'
import { SearchX } from 'lucide-react'
import Loading from '@/app/components/Loading'

function SearchPageWithoutBoundary() {
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

      <div
        className={clsx(
          'w-full min-h-[60vh] flex flex-col items-center gap-6 p-4 justify-center mb-8',
          {
            hidden: resultsCount !== 0 || loading,
          },
        )}
      >
        <SearchX size={60} color="#000" />
        <p className="text-black font-semibold text-xl">
          Nenhum resultado encontrado
        </p>
      </div>

      {loading && (
        <div className="w-full min-h-[60vh] flex flex-col items-center gap-6 p-4 justify-center mb-8">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-main border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          />
        </div>
      )}

      <Footer />
    </section>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchPageWithoutBoundary />
    </Suspense>
  )
}
