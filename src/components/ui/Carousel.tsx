'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useCampaign } from '@/hooks/useCampaign'
import useDimensions from '@/hooks/useDimensions'

import CarouselSkeleton from './Skeleton/CarouselSkeleton'
import Button from './Button'

import '@/assets/swiper.css'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

export default function Carousel() {
  const { campaignData } = useCampaign()
  const [width] = useDimensions()

  return (
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
      {Object.entries(campaignData).map(([id, campaign]) => (
        <SwiperSlide key={id}>
          <article className="w-1/2 flex-shrink-0 flex-grow-0 max-sm:w-full sm:h-full flex items-center justify-center">
            <div className="static left-24 z-50 flex w-[480px] select-none flex-col items-center justify-end gap-4 lg:absolute lg:items-start">
              <h3 className="text-center text-3xl font-semibold text-white lg:text-left">
                {campaign.title}
              </h3>
              <p className="text-center font-medium w-[40vw] max-sm:w-[75vw] text-base text-white lg:text-left">
                {campaign.description}
              </p>
              {campaign.reduction && (
                <Link href={`/campanha/${id}`}>
                  <Button
                    style={{
                      width: '100%',
                      padding: '13px 18px 13px 18px',
                      backgroundColor: '#00A4C7',
                    }}
                  >
                    Ver productos
                  </Button>
                </Link>
              )}
            </div>
          </article>
          <article className="w-1/2 flex-shrink-0 flex-grow-0 max-sm:w-full sm:h-full flex items-center justify-center">
            <Image
              src={campaign.photo}
              alt={campaign.title}
              width={500}
              height={500}
              draggable={false}
              className="select-none"
            />
          </article>
        </SwiperSlide>
      ))}

      {Object.entries(campaignData).length === 0 &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
          <SwiperSlide key={id}>
            <CarouselSkeleton />
          </SwiperSlide>
        ))}
    </Swiper>
  )
}
