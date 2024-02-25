'use client'

import Header from '@/app/components/Header'
import ProductCard from '@/app/components/ProductCard'
import Footer from '@/app/components/Footer'
import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { onValue, ref, query, orderByChild } from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { ProductItem } from '@/@types'

interface FilteredData {
  [key: string]: ProductItem
}

function SearchPageWithoutBoundary() {
  const searchParams = useSearchParams()
  const [productData, setProductData] = useState<Record<string, ProductItem>>(
    {},
  )

  const category = searchParams.get('category') || ''
  const { value: searchValue } = useParams<{ value: string }>()

  useEffect(() => {
    const reference = ref(database, 'products/')
    const productQuery = query(reference, orderByChild('name'))

    onValue(productQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setProductData(data)
      }
    })
  }, [])

  const filteredData: FilteredData = Object.entries(productData).reduce(
    (result: FilteredData, [key, value]) => {
      if (
        (category === '' || value.category === category) &&
        value.name.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        result[key] = value
      }
      return result
    },
    {},
  )

  const resultsCount = Object.keys(filteredData).length

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Client searchDefault={searchValue || ''} />

      <div>
        <p className="text-[#363b44] font-semibold text-base p-4 mt-8 max-sm:text-center">
          PESQUISAR &quot;{searchValue}&quot;
        </p>
        <p className="text-black font-semibold text-3xl p-4 mb-2 max-sm:text-center">
          Foram encontrados {resultsCount} resultados.
        </p>
      </div>

      <div className="w-screen flex flex-wrap gap-6 p-4 max-sm:justify-center mb-8">
        {Object.entries(filteredData).map(([id, product]) => (
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
