'use client'

import { useState, useEffect } from 'react'
import promoHeroe from '@/assets/images/promo-heroe.png'
import Image from 'next/image'

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

export default function PromoBig({ serverTime }: { serverTime: Date }) {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(new Date(serverTime)),
  )

  useEffect(() => {
    const finishDate = new Date(serverTime)
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(finishDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [serverTime])

  return (
    <article className="w-full px-9 py-12 bg-main rounded flex flex-col lg:flex-row justify-between items-center">
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
        <h4 className="text-white font-medium mb-3">Promoção</h4>
        <h5 className="text-white text-4xl font-semibold mt-1">
          Até 60% de desconto direito
        </h5>

        <div className="flex flex-wrap gap-6 mt-5">
          <div className="text-black h-20 w-20 flex flex-col items-center justify-center gap-y-2 bg-white rounded-full p-12 m-auto">
            <p className="font-semibold text-lg">{timeRemaining.days}</p>
            <p className="text-base font-medium">dias</p>
          </div>
          <div className="text-black h-20 w-20 flex flex-col items-center justify-center gap-y-2 bg-white rounded-full p-12 m-auto">
            <p className="font-semibold text-lg">{timeRemaining?.hours}</p>
            <p className="text-base font-medium">horas</p>
          </div>
          <div className="text-black h-20 w-20 flex flex-col items-center justify-center gap-y-2 bg-white rounded-full p-12 m-auto">
            <p className="font-semibold text-lg">{timeRemaining.minutes}</p>
            <p className="text-base font-medium">minutos</p>
          </div>
          <div className="text-black h-20 w-20 flex flex-col items-center justify-center gap-y-2 bg-white rounded-full p-12 m-auto">
            <p className="font-semibold text-lg">{timeRemaining.seconds}</p>
            <p className="text-base font-medium">segundos</p>
          </div>
        </div>

        <button className="mt-6 text-white bg-black font-medium rounded py-4 px-8 active:scale-95 hover:brightness-75">
          Ver produtos
        </button>
      </div>

      <div className="w-full lg:w-3/6 mt-6 lg:mt-0">
        <Image
          src={promoHeroe}
          alt="Promoção"
          width={568}
          height={330}
          className="m-auto"
        />
      </div>
    </article>
  )
}
