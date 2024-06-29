'use client'

import Link from 'next/link'
import { Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Category } from '@/@types'
import CATEGORIES from '@/assets/data/categories'

import '@/assets/swiper.css'

import 'swiper/css/scrollbar'

interface CategoryFilterProps {
  title: string
}

function CategoryCard(props: Category) {
  return (
    <Link href={`/categoria/${props.label}`}>
      <div
        style={{
          backgroundImage: `url(${props.img})`,
          backgroundSize: 'cover',
        }}
        className="h-48 w-48 bg-[#d3d3d3] rounded-full border flex gap-y-2 flex-col justify-center items-center"
      ></div>

      <p className="text-black font-medium mt-5 text-center">{props.label}</p>
    </Link>
  )
}

export default function CategoryFilter(props: CategoryFilterProps) {
  return (
    <div className="p-6 mt-6">
      <h2 className="text-black font-semibold text-3xl">{props.title}</h2>
      <Swiper
        modules={[Scrollbar]}
        slidesPerView={5}
        scrollbar={{
          enabled: true,
        }}
        className="product-card"
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 15,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 15,
          },
        }}
      >
        {CATEGORIES.map((product) => (
          <SwiperSlide key={product.label}>
            <CategoryCard {...product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
