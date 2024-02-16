'use client'

import products from '@/assets/data/products'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/scrollbar'
import { Scrollbar } from 'swiper/modules'
interface Product {
  id: number
  name: string
  href: string
  imageSrc: string
  imageAlt: string
  price: string
  category: string
}

function ProductCard(product: Product) {
  return (
    <div>
      <div className="w-80 h-80 rounded-md group-hover:opacity-75  max-lg:h-64 max-lg:w-64">
        <img
          src={product.imageSrc}
          alt={product.imageAlt}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="w-80 max-lg:w-64 mt-4 flex flex-col">
        <div className="w-full flex justify-between">
          <p className="text-sm text-gray-700">
            <a href={product.href}>{product.name}</a>
          </p>
          <p className="text-sm font-medium text-gray-900">{product.price}</p>
        </div>
        <p className="mt-1 text-left text-sm text-gray-500">
          {product.category}
        </p>
      </div>
    </div>
  )
}

interface ProductListProps {
  title: string
}

const ProductCarousel = (props: ProductListProps) => {
  return (
    <div className="p-6 mt-6">
      <h2 className="text-black font-semibold text-2xl">{props.title}</h2>
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

export default ProductCarousel
