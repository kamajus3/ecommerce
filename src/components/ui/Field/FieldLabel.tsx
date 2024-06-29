import { ReactNode } from 'react'

interface FieldLabelProps {
  htmlFor: string
  children: ReactNode
}

export default function FieldLabel(props: FieldLabelProps) {
  return (
    <label
      htmlFor={props.htmlFor}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {props.children}
    </label>
  )
}
