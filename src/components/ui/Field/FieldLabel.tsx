import { LabelHTMLAttributes } from 'react'

export default function FieldLabel(props: LabelHTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props

  return (
    <label
      className={`block text-sm font-medium leading-6 text-gray-900 ${className}`}
      {...rest}
    />
  )
}
