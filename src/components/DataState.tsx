'use client'

import { AlertCircle } from 'lucide-react'
import { ReactNode } from 'react'

interface DataStateProps {
  dataCount: number
  noDataMessage: string
  loading: boolean
  children: ReactNode // Data Render Component
}

export default function DataState(props: DataStateProps) {
  return (
    <article>
      {!props.loading && props.dataCount === 0 && (
        <div className="w-full min-h-[60vh] flex flex-col items-center gap-6 p-4 justify-center mb-8">
          <AlertCircle size={60} color="#000" />
          <p className="text-[#212121] text-center font-semibold text-lg">
            {props.noDataMessage}
          </p>
        </div>
      )}

      {props.loading && props.dataCount === 0 && (
        <div>
          <div className="w-full min-h-[60vh] flex flex-col items-center gap-6 p-4 justify-center mb-8">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-main border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            />
          </div>
        </div>
      )}

      {props.dataCount > 0 && !props.loading && props.children}
    </article>
  )
}
