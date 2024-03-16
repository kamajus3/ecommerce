import contants from '@/constants'
import useDimensions from '@/hooks/useDimesions'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

interface DashBoardGraphicProps {
  sales: number[]
}

export default function DashBoardGraphic(props: DashBoardGraphicProps) {
  const [width] = useDimensions()

  const data = [
    { name: 'Janeiro', qtd: props.sales[0] },
    { name: 'Fevereiro', qtd: props.sales[1] },
    { name: 'Março', qtd: props.sales[2] },
    { name: 'Abril', qtd: props.sales[3] },
    { name: 'Maio', qtd: props.sales[4] },
    { name: 'Junho', qtd: props.sales[5] },
    { name: 'Julho', qtd: props.sales[6] },
    { name: 'Agosto', qtd: props.sales[7] },
    { name: 'Setembro', qtd: props.sales[8] },
    { name: 'Outubro', qtd: props.sales[9] },
    { name: 'Novembro', qtd: props.sales[10] },
    { name: 'Dezembro', qtd: props.sales[11] },
  ]

  return (
    <BarChart width={width - 30} height={370} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
      <Legend
        width={100}
        wrapperStyle={{
          top: 40,
          right: 20,
          backgroundColor: '#f5f5f5',
          border: '1px solid #d5d5d5',
          borderRadius: 3,
          lineHeight: '40px',
        }}
      />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Bar dataKey="qtd" fill={contants.colors.main} barSize={30} />
    </BarChart>
  )
}
