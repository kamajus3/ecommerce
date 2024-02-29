'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'
import ProductCard from './ProductCard'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import '@/assets/swiper.css'
import { ProductItem, ProductQuery } from '@/@types'
import { getProducts } from '@/lib/firebase/database'
import { useEffect, useState } from 'react'

interface ProductListProps {
  title: string
  query: ProductQuery
}

export default function ProductList(props: ProductListProps) {
  const [productData, setProductData] = useState<Record<string, ProductItem>>(
    {},
  )

  useEffect(() => {
    async function unsubscribed() {
      await getProducts(props.query).then((products) => {
        setProductData(products)
      })
    }

    unsubscribed()
  }, [props.query])

  return (
    <div className="p-6 mt-6">
      <h2 className="text-black font-semibold text-3xl">{props.title}</h2>
      <Swiper
        modules={[Scrollbar]}
        spaceBetween={20}
        slidesPerView={3}
        className="product-card"
        scrollbar={{
          enabled: true,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {Object.entries(productData).map(([id, product]) => (
          <SwiperSlide key={id}>
            {id !== props.query?.except ||
              (!props.query?.except && <ProductCard {...product} id={id} />)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
