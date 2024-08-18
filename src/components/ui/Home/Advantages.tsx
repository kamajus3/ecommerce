import dynamic from 'next/dynamic'
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
  return (
    <article className="p-6 mt-6 flex flex-wrap justify-center items-center">
      <AdvantageCard
        title="Free and Fast Delivery"
        description="Free delivery for orders over 50,000 Kz in Luanda."
        icon="truck"
      />
      <AdvantageCard
        title="24/7 Customer Support"
        description="Friendly customer support available 24/7."
        icon="headset"
      />
      <AdvantageCard
        title="Money-Back Guarantee"
        description="Refunds provided in case of product damage."
        icon="shield-check"
      />
    </article>
  )
}
