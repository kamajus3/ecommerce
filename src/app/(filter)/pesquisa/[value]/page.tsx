'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import clsx from 'clsx'

import { IProduct } from '@/@types'
import DataState from '@/components/ui/DataState'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import ProductCard from '@/components/ui/ProductCard'
import { ProductRepository } from '@/repositories/product.repository'

export default function SearchPage() {
  const [productData, setProductData] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { value: searchValue } = useParams<{ value: string }>()
  const search = decodeURIComponent(searchValue)

  const productRepository = useMemo(() => new ProductRepository(), [])

  useEffect(() => {
    async function unsubscribed() {
      await productRepository
        .findByName({
          search,
        })
        .then((products) => {
          setProductData(products)
        })
      setLoading(false)
    }

    unsubscribed()
  }, [productRepository, search])

  const resultsCount = Object.keys(productData).length

  return (
    <section className="bg-white min-h-screen">
      <Header.Client searchDefault={search} />

      <div>
        <p className="text-[#363b44] font-semibold text-base p-4 mt-8 max-sm:text-center">
          PESQUISAR &quot;{search}&quot;
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
