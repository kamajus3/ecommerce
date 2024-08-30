import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

import Carousel from '@/components/Carousel'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Advantages from '@/components/Home/Advantages'
import CategoryFilter from '@/components/Home/CategoryFilter'
import ProductList from '@/components/ProductList'

const BigCampaign = dynamic(() => import('@/components/Home/BigCampaign'), {
  ssr: false,
})

export default function Home() {
  const t = useTranslations('categories')

  return (
    <section className="bg-white">
      <Header.Client />
      <Carousel />
      <ProductList
        title={t('trending')}
        query={{
          orderBy: 'views',
          limit: 7,
        }}
      />
      <div className="h-32 border-b" />
      <CategoryFilter title={t('filter')} />
      <ProductList
        title={t('weekly')}
        query={{
          orderBy: 'updatedAt',
          limit: 8,
        }}
      />
      <div className="h-32 border-b" />
      <BigCampaign />
      <ProductList
        title={t('health')}
        query={{
          filterBy: { category: 'health' },
          limit: 8,
        }}
      />
      <ProductList
        title={t('baby')}
        query={{
          filterBy: { category: 'baby' },
          limit: 8,
        }}
      />
      <ProductList
        title={t('care')}
        query={{
          filterBy: { category: 'hygiene' },
          limit: 8,
        }}
      />
      <ProductList
        title={t('insecticides')}
        query={{
          filterBy: { category: 'insecticides' },
          limit: 8,
        }}
      />
      <ProductList
        title={t('food')}
        query={{
          filterBy: { category: 'food' },
          limit: 8,
        }}
      />
      <Advantages />
      <Footer />
    </section>
  )
}
