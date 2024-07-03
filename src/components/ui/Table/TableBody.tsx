import { ReactNode } from 'react'

export default function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="text-gray-600 text-sm font-light">{children}</tbody>
}
