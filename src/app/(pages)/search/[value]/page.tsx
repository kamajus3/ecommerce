'use client'

import Header from '@/app/components/Header'
import ProductCard from '@/app/components/ProductCard'
import Footer from '@/app/components/Footer'
import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { ProductItem } from '@/@types'
import { getProducts } from '@/lib/firebase/database'
import clsx from 'clsx'
import { SearchX } from 'lucide-react'
import Loading from '@/app/components/Loading'

function SearchPageWithoutBoundary() {
  const searchParams = useSearchParams()
  const [productData, setProductData] = useState<Record<string, ProductItem>>(
    {},
  )

  const category = searchParams.get('value') || ''
  const { value: searchValue } = useParams<{ value: string }>()
  const search = decodeURIComponent(searchValue)

  useEffect(() => {
    async function unsubscribed() {
      await getProducts({
        search: category ? undefined : search,
        category,
      }).then((products) => {
        setProductData(products)
      })
    }

    unsubscribed()
  }, [search, category])

  const resultsCount = Object.keys(productData).length

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Client searchDefault={category && search ? undefined : search} />

      <div>
        {category && search ? (
          <p className="text-[#363b44] font-semibold text-base p-4 mt-8 max-sm:text-center">
            PRODUCTOS DA CATEGÓRIA &quot;{category}&quot;
          </p>
        ) : (
          <p className="text-[#363b44] font-semibold text-base p-4 mt-8 max-sm:text-center">
            PESQUISAR &quot;{search}&quot;
          </p>
        )}
        <p
          className={clsx(
            'text-black font-semibold text-3xl p-4 mb-2 max-sm:text-center',
            {
              hidden: resultsCount === 0,
            },
          )}
        >
          Foram encontrados {resultsCount} resultados.
        </p>
      </div>

      <div
        className={clsx(
          'w-screen min-h-[50vh] flex flex-wrap gap-6 p-4 max-sm:justify-center mb-8',
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
          'w-screen min-h-[60vh] flex flex-col items-center gap-6 p-4 justify-center mb-8',
          {
            hidden: resultsCount !== 0,
          },
        )}
      >
        <SearchX size={60} color="#000" />
        <p className="text-black font-semibold text-xl">
          Nenhum resultado encontrado
        </p>
      </div>

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
