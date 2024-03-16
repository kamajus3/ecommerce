import { TrendingDown, TrendingUp } from 'lucide-react'

interface DashBoardCardProps {
  title: string
  quantity: number
  rate?: number
  rateMessage?: string
}

export default function DashBoardCard({
  title,
  quantity,
  rate,
  rateMessage,
}: DashBoardCardProps) {
  return (
    <div className="flex flex-col gap-4 border p-4">
      <h3 className="text-[#979797] font-medium">{title}</h3>
      <span className="text-5xl text-black font-semibold">
        {quantity.toLocaleString('pt-br')}
      </span>
      {rateMessage && rate && (
        <div className="text-[#979797] font-medium">
          <mark
            style={{
              color: rate > 0 ? 'red' : 'green',
              background: 'none',
            }}
          >
            {rate > 0 ? (
              <TrendingDown size={20} className="inline" />
            ) : (
              <TrendingUp size={20} className="inline" />
            )}{' '}
            {Math.abs(rate)}%
          </mark>{' '}
          {rateMessage}
        </div>
      )}
    </div>
  )
}
