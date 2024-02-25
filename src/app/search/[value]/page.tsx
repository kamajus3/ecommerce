'use client'

import Header from '@/app/components/Header'
import ProductCard from '@/app/components/ProductCard'
import Footer from '@/app/components/Footer'
import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { ProductItem } from '@/@types'
import { getProducts } from '@/lib/firebase/database'

function SearchPageWithoutBoundary() {
  const searchParams = useSearchParams()
  const [productData, setProductData] = useState<Record<string, ProductItem>>(
    {},
  )

  const category = searchParams.get('category') || ''
  const { value: search } = useParams<{ value: string }>()

  useEffect(() => {
    async function unsubscribed() {
      await getProducts({
        search,
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
      <Header.Client searchDefault={search} />

      <div>
        <p className="text-[#363b44] font-semibold text-base p-4 mt-8 max-sm:text-center">
          PESQUISAR &quot;{search}&quot;
        </p>
        <p className="text-black font-semibold text-3xl p-4 mb-2 max-sm:text-center">
          Foram encontrados {resultsCount} resultados.
        </p>
      </div>

      <div className="w-screen flex flex-wrap gap-6 p-4 max-sm:justify-center mb-8">
        {Object.entries(productData).map(([id, product]) => (
          <ProductCard key={id} {...product} id={id} />
        ))}
      </div>

      <Footer />
    </section>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchPageWithoutBoundary />
    </Suspense>
  )
}
