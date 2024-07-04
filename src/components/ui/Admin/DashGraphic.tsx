import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import constants from '@/constants'

interface IDashGraphic {
  sales: number[]
}

export default function DashGraphic(props: IDashGraphic) {
  const data = [
    { name: 'Jan', qtd: props.sales[0] },
    { name: 'Fev', qtd: props.sales[1] },
    { name: 'Mar', qtd: props.sales[2] },
    { name: 'Abr', qtd: props.sales[3] },
    { name: 'Mai', qtd: props.sales[4] },
    { name: 'Jun', qtd: props.sales[5] },
    { name: 'Jul', qtd: props.sales[6] },
    { name: 'Ago', qtd: props.sales[7] },
    { name: 'Set', qtd: props.sales[8] },
    { name: 'Out', qtd: props.sales[9] },
    { name: 'Nov', qtd: props.sales[10] },
    { name: 'Dez', qtd: props.sales[11] },
  ]

  return (
    <ResponsiveContainer width="100%" maxHeight={500} aspect={2}>
      <BarChart data={data}>
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
        <Bar dataKey="qtd" fill={constants.colors.main} barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  )
}
