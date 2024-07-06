'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { ICampaignBase } from '@/@types'
import Button from '@/components/ui/Button'
import { calculateTimeRemaining, campaignValidator } from '@/functions'
import { formatPhotoUrl } from '@/functions/format'
import { useCampaign } from '@/hooks/useCampaign'
import { useInformation } from '@/hooks/useInformation'

export default function PromoBig() {
  const { campaignData } = useCampaign()
  const { informationsData } = useInformation()
  const [fixedCampaign, setFixedCampaign] = useState<ICampaignBase | null>(null)
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (informationsData.fixedCampaign) {
      const campaign = campaignData[informationsData.fixedCampaign]
      if (campaign) {
        setFixedCampaign({
          ...campaign,
          id: informationsData.fixedCampaign,
        })
      }
    }
  }, [campaignData, informationsData.fixedCampaign])

  useEffect(() => {
    if (fixedCampaign?.finishDate) {
      const finishDate = new Date(fixedCampaign.finishDate)
      const timer = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(finishDate))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [fixedCampaign])

  return (
    fixedCampaign &&
    campaignValidator(fixedCampaign) && (
      <article className="w-full px-9 py-12 bg-main flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-2/5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <h4 className="text-white font-medium mb-3">
            {fixedCampaign.reduction && Number(fixedCampaign.reduction) > 0
              ? 'Campanha promocional'
              : 'Campanha'}
          </h4>
          <h5 className="text-white text-4xl font-semibold mt-1">
            {fixedCampaign.title}
          </h5>

          <div>
            <p className="text-white mt-5 text-sm mb-2">Termina em:</p>
            <div className="flex flex-wrap gap-6">
              <div className="text-black h-16 w-16 flex flex-col items-center justify-center gap-y-2 bg-white rounded p-12 m-auto select-none">
                <p className="font-semibold text-lg">{timeRemaining.days}</p>
                <p className="text-base font-medium">dias</p>
              </div>
              <div className="text-black h-16 w-16 flex flex-col items-center justify-center gap-y-2 bg-white rounded p-12 m-auto select-none">
                <p className="font-semibold text-lg">{timeRemaining.hours}</p>
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
          </div>

          <Link href={`/campanha/${fixedCampaign.id}`}>
            <Button className="mt-6 bg-secondary border border-white py-4 px-9 active:scale-95 hover:brightness-75">
              Ver produtos
            </Button>
          </Link>
        </div>

        <div className="w-full lg:w-3/6 mt-6 lg:mt-0">
          <Image
            src={formatPhotoUrl(fixedCampaign.photo, fixedCampaign.updatedAt)}
            alt={fixedCampaign.title}
            width={400}
            height={400}
            className="m-auto"
          />
        </div>
      </article>
    )
  )
}
