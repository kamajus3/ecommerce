'use client'

import React, { useState, useEffect } from 'react'

export default function Promo() {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining())

  function calculateTimeRemaining() {
    const finishDate = new Date()
    finishDate.setDate(finishDate.getDate() + 5)
    const timeDiff = finishDate.getTime() - new Date().getTime()
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
    return { days, hours, minutes, seconds }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <article className="w-full h-[60vh] px-6 bg-black rounded">
      <div className="h-full w-[35%] flex flex-col justify-around">
        <span className="text-[#00A4C7] font-medium">Promoção</span>
        <h3 className="text-white text-4xl font-semibold">
          Aproveite Esta Grande Promoção
        </h3>

        <div className="flex gap-x-6">
          <div className="text-black h-20 w-20 flex flex-col items-center justify-center gap-2 bg-white rounded-full p-20">
            <span className="font-semibold text-base">
              {timeRemaining.days}
            </span>
            <span className="text-base font-medium">dias</span>
          </div>
          <div className="text-black h-20 w-20 flex flex-col items-center justify-center gap-2 bg-white rounded-full p-4">
            <span className="font-semibold text-base">
              {timeRemaining.hours}
            </span>
            <span className="text-base font-medium">horas</span>
          </div>
          <div className="text-black h-20 w-20 flex flex-col items-center justify-center gap-2 bg-white rounded-full p-4">
            <span className="font-semibold text-base">
              {timeRemaining.minutes}
            </span>
            <span className="text-base font-medium">minutos</span>
          </div>
          <div className="text-black h-20 w-20 flex flex-col items-center justify-center gap-2 bg-white rounded-full p-8">
            <span className="font-semibold text-base">
              {timeRemaining.seconds}
            </span>
            <span className="text-base font-medium">segundos</span>
          </div>
        </div>

        <button className="text-white bg-[#00A4C7] font-medium rounded py-4 px-8 active:scale-95">
          Comprar agora
        </button>
      </div>
    </article>
  )
}
