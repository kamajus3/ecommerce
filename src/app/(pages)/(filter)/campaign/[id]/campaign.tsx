'use client'

import Header from '@/app/components/Header'
import ProductCard from '@/app/components/ProductCard'
import Footer from '@/app/components/Footer'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProductItem, PromotionItemBase } from '@/@types'
import { getProducts } from '@/lib/firebase/database'
import clsx from 'clsx'
import { SearchX } from 'lucide-react'
import { child, get, ref } from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { campaignValidator, publishedSince } from '@/functions'

export function SearchPageWithoutBoundary() {
  const [productData, setProductData] = useState<Record<string, ProductItem>>(
    {},
  )
  const [promotionData, setPromotionData] = useState<PromotionItemBase>()
  const [loading, setLoading] = useState(true)
  const { id: campaign } = useParams<{ id: string }>()

  useEffect(() => {
    async function unsubscribed() {
      get(child(ref(database), `promotions/${campaign}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setPromotionData(snapshot.val())
          if (!campaignValidator(snapshot.val())) {
            notFound()
          }
        } else {
          notFound()
        }
      })

      await getProducts({
        promotion: campaign,
      }).then((products) => {
        setProductData(products)
      })

      setLoading(false)
    }

    unsubscribed()
  }, [campaign])

  const resultsCount = Object.keys(productData).length

  return (
    <section className="bg-white min-h-screen overflow-hidden">
      <Header.Client />

      {promotionData && (
        <article className="p-4 mx-auto mt-9">
          {campaignValidator(promotionData) === 'promotion' && (
            <span className="text-black font-medium text-sm uppercase">
              A promoção termina {publishedSince(promotionData.finishDate)}
            </span>
          )}
          <h2 className="text-black font-semibold text-2xl">
            {promotionData.title}
          </h2>
          <p className="text-[#212121] text-sm max-w-10">
            {promotionData.description}
          </p>
        </article>
      )}

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
          'w-screen min-h-[60vh] flex flex-col items-center gap-6 p-4 justify-center mb-8',
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
        <div className="w-screen min-h-[60vh] flex flex-col items-center gap-6 p-4 justify-center mb-8">
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
