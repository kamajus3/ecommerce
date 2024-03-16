interface DashBoardCardProps {
  title: string
  quantity: number
  warn?: string
}

export default function DashBoardCard({
  title,
  quantity,
  warn,
}: DashBoardCardProps) {
  return (
    <div className="flex flex-col gap-4 border p-4">
      <h3 className="text-[#979797] font-medium">{title}</h3>
      <span className="text-5xl text-black font-semibold">
        {quantity.toLocaleString('pt-br')}
      </span>
      <p className="text-[#979797] font-medium">{warn}</p>
    </div>
  )
}
