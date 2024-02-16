'use client'

import products from '@/assets/data/products'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/scrollbar'
import { Scrollbar } from 'swiper/modules'
import ProductCard from './ProductCard'

interface ProductListProps {
  title: string
}

export default function ProductList(props: ProductListProps) {
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
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard {...product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
