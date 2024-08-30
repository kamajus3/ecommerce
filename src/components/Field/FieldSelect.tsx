import { ForwardedRef, forwardRef, SelectHTMLAttributes } from 'react'
import clsx from 'clsx'
import { FieldError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface IFieldSelect extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: FieldError | undefined
  options: {
    value: string
    label: string
  }[]
}

function CustomSelect(
  props: IFieldSelect,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={twMerge(
        clsx(
          'cursor-pointer mt-2 rounded-lg bg-transparent px-3 py-2 text-gray-500 outline-none border',
          {
            'border-red-500': props.error,
          },
        ),
        props.className,
      )}
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
