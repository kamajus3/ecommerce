'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { PromotionItemBase } from '@/@types'
import { campaignValidator } from '@/functions'
import { useInformation } from '@/hooks/useInformation'
import { usePromotion } from '@/hooks/usePromotion'

function calculateTimeRemaining(finishDate: Date) {
  const currentTime = new Date().getTime()
  const finishTime = finishDate.getTime()

  if (finishTime < currentTime) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const timeDiff = finishTime - currentTime

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export default function PromoBig() {
  const { promotionData } = usePromotion()
  const { informationsData } = useInformation()
  const [fixedPromo, setFixedPromo] = useState<PromotionItemBase>()

  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(
      fixedPromo ? new Date(fixedPromo.finishDate) : new Date(),
    ),
  )

  useEffect(() => {
    if (informationsData.promotionFixed) {
      Object.entries(promotionData).map(([id, promotion]) => {
        if (id === informationsData.promotionFixed) {
          setFixedPromo({
            ...promotion,
            id,
          })
        }
        return null
      })
    }
  }, [promotionData, informationsData.promotionFixed])

  useEffect(() => {
    const finishDate = new Date(
      fixedPromo ? new Date(fixedPromo.finishDate) : new Date(),
    )
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(finishDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [fixedPromo])

  return (
    fixedPromo &&
    campaignValidator(fixedPromo) && (
      <article className="w-full px-9 py-12 bg-main flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-2/5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <h4 className="text-white font-medium mb-3">
            {fixedPromo.reduction > 0 ? 'Promoção' : 'Campanha'}
          </h4>
          <h5 className="text-white text-4xl font-semibold mt-1">
            {fixedPromo.title}
          </h5>

          <div className="flex flex-wrap gap-6 mt-5">
            <div className="text-black h-16 w-16 flex flex-col items-center justify-center gap-y-2 bg-white rounded p-12 m-auto select-none">
              <p className="font-semibold text-lg">{timeRemaining.days}</p>
              <p className="text-base font-medium">dias</p>
            </div>
            <div className="text-black h-16 w-16 flex flex-col items-center justify-center gap-y-2 bg-white rounded p-12 m-auto select-none">
              <p className="font-semibold text-lg">{timeRemaining?.hours}</p>
              <p className="text-base font-medium">horas</p>
            </div>
            <div className="text-black h-16 w-16 flex flex-col items-center justify-center gap-y-2 bg-white rounded p-12 m-auto select-none">
              <p className="font-semibold text-lg">{timeRemaining.minutes}</p>
              <p className="text-base font-medium">minutos</p>
            </div>
            <div className="text-black h-16 w-16 flex flex-col items-center justify-center gap-y-2 bg-white rounded p-12 m-auto select-none">
              <p className="font-semibold text-lg">{timeRemaining.seconds}</p>
              <p className="text-base font-medium">segundos</p>
            </div>
          </div>

          <Link
            href={`/campanha/${fixedPromo.id}`}
            className="mt-6 text-white bg-[#00A4C7] font-medium rounded py-4 px-9 active:scale-95 hover:brightness-75 border border-white"
          >
            Ver produtos
          </Link>
        </div>

        <div className="w-full lg:w-3/6 mt-6 lg:mt-0">
          <Image
            src={fixedPromo.photo}
            alt={fixedPromo.photo}
            width={400}
            height={400}
            className="m-auto"
          />
        </div>
      </article>
    )
  )
}
