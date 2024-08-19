'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { ICategory } from '@/@types'
import CATEGORIES from '@/assets/data/categories'
import { Link } from '@/navigation'

import '@/assets/swiper.css'

import 'swiper/css/scrollbar'

interface ICategoryFilter {
  title: string
}

interface ICategoryCard {
  category: ICategory
}

function CategoryCard({ category }: ICategoryCard) {
  const t = useTranslations('categories')

  return (
    <Link className="inline-block w-48" href={`/category/${category.label}`}>
      <div className="w-48 h-48 mb-8 relative">
        <Image
          src={category.img}
          alt={t(`labels.${category.label}`)}
          draggable={false}
          className="select-none rounded-full border object-cover object-center"
          fill
        />
      </div>
      <span className="text-black font-medium text-center">
        {t(`labels.${category.label}`)}
      </span>
    </Link>
  )
}

export default function CategoryFilter({ title }: ICategoryFilter) {
  return (
    <div className="p-6 mt-6">
      <h2 className="text-black font-semibold text-3xl">{title}</h2>
      <Swiper
        modules={[Scrollbar]}
        scrollbar={{ enabled: true }}
        className="swiperCard"
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
        {CATEGORIES.map((category) => (
          <SwiperSlide key={category.label}>
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
