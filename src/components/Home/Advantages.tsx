'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

interface IAdvantageCard {
  title: string
  description: string
  icon: keyof typeof dynamicIconImports
}

function AdvantageCard({ title, description, icon }: IAdvantageCard) {
  const LucideIcon = dynamic(dynamicIconImports[icon])

  return (
    <div className="mt-8 mb-16 w-[490px] max-sm:w-[80%] flex flex-col items-center justify-center gap-y-4 p-6">
      <div className="bg-primary h-20 w-20 rounded-full flex items-center justify-center border-8 border-secondary">
        <LucideIcon color="#fff" size={40} aria-hidden="true" />
      </div>
      <span className="font-semibold text-xl text-primary text-center">
        {title}
      </span>
      <p className="text-black font-medium text-base text-center">
        {description}
      </p>
    </div>
  )
}

export default function Advantages() {
  const t = useTranslations('structure')

  return (
    <article className="p-6 mt-6 flex flex-wrap justify-center items-center">
      <AdvantageCard
        title={t('advantages.qualityProducts.title')}
        description={t('advantages.qualityProducts.description')}
        icon="sparkles"
      />
      <AdvantageCard
        title={t('advantages.customerSupport.title')}
        description={t('advantages.customerSupport.description')}
        icon="headset"
      />
      <AdvantageCard
        title={t('advantages.moneyBackGuarantee.title')}
        description={t('advantages.moneyBackGuarantee.description')}
        icon="shield-check"
      />
    </article>
  )
}
