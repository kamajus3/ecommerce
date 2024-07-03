import { ReactNode } from 'react'

export default function TableHeader({ children }: { children: ReactNode }) {
  return <th className="p-3 font-semibold text-base">{children}</th>
}
