import React from 'react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('admin.dashboard')

  const data = [
    { name: t('months.jan'), qtd: props.sales[0] },
    { name: t('months.feb'), qtd: props.sales[1] },
    { name: t('months.mar'), qtd: props.sales[2] },
    { name: t('months.apr'), qtd: props.sales[3] },
    { name: t('months.may'), qtd: props.sales[4] },
    { name: t('months.jun'), qtd: props.sales[5] },
    { name: t('months.jul'), qtd: props.sales[6] },
    { name: t('months.aug'), qtd: props.sales[7] },
    { name: t('months.sep'), qtd: props.sales[8] },
    { name: t('months.oct'), qtd: props.sales[9] },
    { name: t('months.nov'), qtd: props.sales[10] },
    { name: t('months.dec'), qtd: props.sales[11] },
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
        <Bar dataKey="qtd" fill={constants.colors.primary} barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  )
}
