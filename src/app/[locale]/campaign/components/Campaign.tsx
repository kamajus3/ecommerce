'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

import { ICampaign, IProduct } from '@/@types'
import DataState from '@/components/ui/DataState'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import ProductCard from '@/components/ui/ProductCard'
import { calculateTimeRemaining, campaignValidator } from '@/functions'
import { ProductRepository } from '@/repositories/product.repository'

export function Campaign(campaign: ICampaign) {
  const t = useTranslations()

  const productRepository = useMemo(() => new ProductRepository(), [])
  const [productData, setProductData] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    async function unsubscribed() {
      await productRepository
        .find({
          filterBy: { 'campaign/id': campaign.id },
        })
        .then((products) => {
          setProductData(products)
        })
      setLoading(false)
    }

    unsubscribed()
  }, [campaign.id, productRepository])

  useEffect(() => {
    if (campaign.endDate) {
      const endDate = new Date(campaign.endDate)
      const timer = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(endDate))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [campaign])

  const resultsCount = Object.keys(productData).length

  return (
    <section className="bg-white min-h-screen overflow-x-hidden">
      <Header.Client />

      <article className="p-4 mx-auto mt-9">
        {campaign.endDate &&
          campaignValidator(campaign) === 'promotional-campaign' && (
            <span className="text-black font-medium text-sm uppercase">
              {t('campaign.promotionDuration', {
                ...timeRemaining,
              })}
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
          ? t('search.foundCount', {
              resultsCount,
            })
          : t('search.foundMoreThanCount', {
              resultsCount,
            })}
      </p>

      <DataState
        dataCount={resultsCount}
        loading={loading}
        noDataMessage={t('search.notFound')}
      >
        <div
          className={clsx(
            'w-screen min-h-[120vh] flex flex-wrap gap-9 p-6 justify-center mb-8 max-w-[98vw]',
            {
              hidden: resultsCount === 0,
            },
          )}
        >
          {productData.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </DataState>

      <Footer />
    </section>
  )
}
