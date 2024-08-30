import { LabelHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export default function FieldLabel({
  className,
  ...props
}: LabelHTMLAttributes<HTMLElement>) {
  return (
    <label
      className={twMerge(
        'block text-sm font-medium leading-6 text-gray-900',
        className,
      )}
      {...props}
    />
  )
}
