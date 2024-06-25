import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'

interface AdvantageCardProps {
  title: string
  description: string
  icon: keyof typeof dynamicIconImports
}

function AdvantageCard(props: AdvantageCardProps) {
  const LucideIcon = dynamic(dynamicIconImports[props.icon])

  return (
    <div className="mt-8 mb-16 w-[400px] max-sm:w-[80%] flex flex-col items-center justify-center gap-y-2 p-6">
      <div className="bg-main h-20 w-20 rounded-full flex items-center justify-center border-8 border-[#00A4C7]">
        <LucideIcon color="#fff" size={40} />
      </div>
      <span className="font-semibold text-xl text-main text-center">
        {props.title}
      </span>
      <p className="text-black font-medium text-base text-center">
        {props.description}
      </p>
    </div>
  )
}

export default function Advantages() {
  return (
    <article className="p-6 mt-6 flex flex-wrap justify-center items-center">
      <AdvantageCard
        title="ENTREGA GRATUITA E RÁPIDA"
        description="Entrega gratuita para todos os pedidos acima de 50.000,00 kz na cidade de Luanda"
        icon="truck"
      />
      <AdvantageCard
        title="ATENDIMENTO 24/7"
        description="Suporte ao cliente amigável 24 horas por dia, 7 dias por semana"
        icon="headset"
      />
      <AdvantageCard
        title=" GARANTIA DE DEVOLUÇÃO DE DINHEIRO"
        description="Devolvemos o dinheiro em caso de mau estado de conservação do producto"
        icon="shield-check"
      />
    </article>
  )
}
