import { ReactNode } from 'react'

export default function TableData({ children }: { children: ReactNode }) {
  return <td className="p-3 text-center text-black font-medium">{children}</td>
}
