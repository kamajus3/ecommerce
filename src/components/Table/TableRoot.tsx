import { ReactNode } from 'react'

export default function TableRoot({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto table-wrapper">
      <table className="table-auto w-full">{children}</table>
    </div>
  )
}
