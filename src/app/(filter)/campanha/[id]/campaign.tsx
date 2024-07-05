'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { ICampaign, IProduct } from '@/@types'
import DataState from '@/components/ui/DataState'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import ProductCard from '@/components/ui/ProductCard'
import { campaignValidator, publishedSince } from '@/functions'
import { getProducts } from '@/services/firebase/database'

export function CampaingPage(campaign: ICampaign) {
  const [productData, setProductData] = useState<Record<string, IProduct>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function unsubscribed() {
      await getProducts({
        campaign: campaign.id,
      }).then((products) => {
        setProductData(products)
      })
      setLoading(false)
    }

    unsubscribed()
  }, [campaign.id])

  const resultsCount = Object.keys(productData).length

  return (
    <section className="bg-white min-h-screen overflow-x-hidden">
      <Header.Client />

      <article className="p-4 mx-auto mt-9">
        {campaign.finishDate &&
          campaignValidator(campaign) === 'campaign-with-promotion' && (
            <span className="text-black font-medium text-sm uppercase">
              A promoção termina {publishedSince(campaign.finishDate)}
            </span>
          )}

        <h2 className="text-black font-semibold text-2xl">{campaign.title}</h2>
        <p className="text-[#212121] text-sm w-[80vw]">
          {campaign.description}
        </p>
      </article>

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
