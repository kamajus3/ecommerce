'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import clsx from 'clsx'
import { child, get, ref } from 'firebase/database'

import { ProductItem, PromotionItemBase } from '@/@types'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import DataState from '@/components/ui/DataState'
import Header from '@/components/ui/Header'
import { campaignValidator, publishedSince } from '@/functions'
import { database } from '@/lib/firebase/config'
import { getProducts } from '@/lib/firebase/database'

export function CampaingPage() {
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
    <section className="bg-white min-h-screen">
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
          <p className="text-[#212121] text-sm w-[80vw]">
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
