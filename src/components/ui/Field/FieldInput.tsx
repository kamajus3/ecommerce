import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form'

interface FieldInput extends InputHTMLAttributes<HTMLInputElement> {
  error: FieldError | undefined
}

function CustomInput(props: FieldInput, ref: ForwardedRef<HTMLInputElement>) {
  const { className, ...rest } = props
  return (
    <input
      className={`w-full rounded-lg bg-neutral-100 px-3 py-2 mt-2 text-gray-500 bg-transparent outline-none border ${props.error && 'border-red-500'} ${className}`}
      {...rest}
      ref={ref}
    />
  )
}

const FieldInput = forwardRef(CustomInput)
export default FieldInput
