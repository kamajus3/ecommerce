import { ReactNode } from 'react'
import clsx from 'clsx'

interface TableRowProps {
  inside: 'head' | 'body'
  children: ReactNode
}
export default function TableRow({ children, inside }: TableRowProps) {
  return (
    <tr
      className={clsx('', {
        'border-y border-gray-200 border-y-[#dfdfdf]': inside === 'body',
        'bg-[#F9FAFB] text-gray-600 text-sm': inside === 'head',
      })}
    >
      {children}
    </tr>
  )
}
