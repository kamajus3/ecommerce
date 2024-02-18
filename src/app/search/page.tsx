'use client'

import Header from '@/app/components/Header'
import ProductCard from '@/app/components/ProductCard'
import products from '@/assets/data/products'
import Footer from '@/app/components/Footer'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SearchPageWithoutBoundary() {
  const searchParams = useSearchParams()
  const searchValue = searchParams.get('value')

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header searchDefault={searchValue} />

      <div>
        <p className="text-[#363b44] font-semibold text-base p-4 mt-8 max-sm:text-center">
          PESQUISAR &quot;{searchValue}&quot;
        </p>
        <p className="text-black font-semibold text-3xl p-4 mb-2 max-sm:text-center">
          Foram encontrados {products.length} resultados.
        </p>
      </div>

      <div className="w-screen flex flex-wrap gap-6 p-4 max-sm:justify-center mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <Footer />
    </section>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageWithoutBoundary />
    </Suspense>
  )
}
