'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { IProduct, IProductQuery } from '@/@types'
import { getProducts } from '@/services/firebase/database'

import ProductCardSkeleton from './Skeleton/ProductCardSkeleton'
import ProductCard from './ProductCard'

import '@/assets/swiper.css'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

interface ProductListProps {
  title: string
  query: IProductQuery
}

export default function ProductList(props: ProductListProps) {
  const [productData, setProductData] = useState<Record<string, IProduct>>({})

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function unsubscribed() {
      await getProducts(props.query).then((products) => {
        setProductData(products)
        setLoading(false)
      })
    }

    unsubscribed()
  }, [props.query])

  return (
    <div
      className={clsx('p-6 mt-6', {
        hidden: !loading && Object.entries(productData).length === 0,
      })}
    >
      <h2 className="text-black font-semibold text-3xl">{props.title}</h2>
      <Swiper
        modules={[Scrollbar]}
        spaceBetween={20}
        className="swiperCard"
        scrollbar={{
          enabled: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
      >
        {Object.entries(productData).map(([id, product]) => (
          <SwiperSlide key={id}>
            <ProductCard {...product} id={id} />
          </SwiperSlide>
        ))}

        {loading &&
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
            <SwiperSlide key={id}>
              <ProductCardSkeleton />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  )
}
