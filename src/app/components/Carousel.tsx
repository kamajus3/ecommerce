'use client'
import React, { ButtonHTMLAttributes } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import '@/assets/swiper.css'

import {
  Pagination,
  Navigation,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper/modules'
import useDimensions from '@/hooks/useDimesions'
import Link from 'next/link'
import { usePromotion } from '@/hooks/usePromotion'
import Image from 'next/image'

function CarouselButton(props: ButtonHTMLAttributes<HTMLElement>) {
  return (
    <button
      className="flex items-center gap-2 py-3 px-6 text-base bg-white text-black transition-all border-none active:brightness-75 hover:brightness-90"
      {...props}
    >
      {props.children}
    </button>
  )
}
export default function Carousel() {
  const { promotionData } = usePromotion()
  const [width] = useDimensions()

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={30}
        pagination={{ dynamicBullets: true }}
        navigation={!(width <= 600)}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="mySwiper"
      >
        {Object.entries(promotionData).map(([id, promotion]) => (
          <SwiperSlide key={id} className="bg-main flex">
            <article className="w-1/2 h-full">
              <div className="static left-24 z-50 flex w-[480px] select-none flex-col items-center justify-end gap-4 lg:absolute lg:items-start">
                <h3 className="text-center text-3xl font-semibold text-white lg:text-left">
                  {promotion.title}
                </h3>
                <p className="text-center text-base text-white lg:text-left">
                  {promotion.description}
                </p>
                <Link href={`/campaign/${id}`}>
                  <CarouselButton>Ver productos</CarouselButton>
                </Link>
              </div>
            </article>
            <article className="w-1/2 h-full flex items-center justify-center">
              <Image
                src={promotion.photo}
                alt={promotion.title}
                width={300}
                height={300}
                draggable={false}
                className="select-none"
              />
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
