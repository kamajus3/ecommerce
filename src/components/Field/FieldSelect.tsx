import { ForwardedRef, SelectHTMLAttributes, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

interface FieldSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: FieldError | undefined
  options: {
    value: string
    label: string
  }[]
}

function CustomSelect(
  props: FieldSelectProps,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={`mt-2 rounded-lg bg-neutral-100 px-3 py-2 text-gray-500 bg-transparent outline-none border ${props.error && 'border-red-500'} ${props.className}`}
      ref={ref}
    >
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

const FieldSelect = forwardRef(CustomSelect)
export default FieldSelect
