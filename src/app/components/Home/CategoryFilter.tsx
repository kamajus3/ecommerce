'use client'

import { Swiper, SwiperSlide } from 'swiper/react'

import CATEGORIES from '@/assets/data/categories'
import { Scrollbar } from 'swiper/modules'
import dynamic from 'next/dynamic'
import Category from '@/@types/categories'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

import 'swiper/css/scrollbar'
import '@/assets/swiper.css'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { ProductItem } from '@/@types'
import ProductCard from '../ProductCard'
import { getProducts } from '@/lib/firebase/database'

interface CategoryFilterProps {
  title: string
}

interface CategoryCardProps extends Category {
  onClick(): void
  category: string
}

function CategoryCard(props: CategoryCardProps) {
  const LucideIcon = dynamic(dynamicIconImports[props.icon])

  return (
    <button
      className={clsx(
        'h-48 w-48 bg-red-500 rounded border flex gap-y-2 flex-col justify-center items-center',
        {
          'bg-white ': props.category !== props.label,
        },
      )}
      onClick={props.onClick}
    >
      <LucideIcon
        color={props.category === props.label ? '#fff' : '#000'}
        size={60}
      />
      <p
        className={clsx('text-black font-medium', {
          'text-white': props.category === props.label,
        })}
      >
        {props.label}
      </p>
    </button>
  )
}

export default function CategoryFilter(props: CategoryFilterProps) {
  const [category, setCategory] = useState(CATEGORIES[0].label)

  const [productData, setProductData] = useState<Record<string, ProductItem>>(
    {},
  )

  useEffect(() => {
    async function unsubscribed() {
      await getProducts({
        category,
        limit: 15,
      }).then((products) => {
        setProductData(products)
      })
    }

    unsubscribed()
  }, [category])

  return (
    <div className="p-6 mt-6">
      <h2 className="text-black font-semibold text-3xl">{props.title}</h2>
      <Swiper
        modules={[Scrollbar]}
        spaceBetween={20}
        slidesPerView={5}
        className="product-card"
        breakpoints={{
          320: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
      >
        {CATEGORIES.map((product) => (
          <SwiperSlide key={product.label}>
            <CategoryCard
              {...product}
              category={category}
              onClick={() => {
                setCategory(product.label)
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="p-2 mt-6">
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
              <ProductCard {...product} id={id} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
