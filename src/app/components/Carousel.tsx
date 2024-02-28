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
import { CAROUSEL } from '@/assets/data/carousel'
import Link from 'next/link'

function CarouselButton(props: ButtonHTMLAttributes<HTMLElement>) {
  return (
    <button
      className="flex items-center gap-2 py-3 px-6 text-base bg-main text-white transition-all border-none active:brightness-75 hover:brightness-90"
      {...props}
    >
      {props.children}
    </button>
  )
}
export default function Carousel() {
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
        {CAROUSEL.map((data) => (
          <SwiperSlide
            key={data.title}
            style={{ backgroundImage: `url(${data.image})` }}
          >
            <div className="static left-24 z-50 flex w-[480px] select-none flex-col items-center justify-end gap-4 lg:absolute lg:items-start">
              <h3 className="text-center text-3xl font-semibold text-white lg:text-left">
                {data.title}
              </h3>
              <p className="text-center text-base text-white lg:text-left">
                {data.content}
              </p>
              <Link href={data.url}>
                <CarouselButton>Ver productos</CarouselButton>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
