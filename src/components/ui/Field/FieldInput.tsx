import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react'
import clsx from 'clsx'
import { FieldError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface IFieldInput extends InputHTMLAttributes<HTMLInputElement> {
  error: FieldError | undefined
}

function CustomInput(
  { className, error, ...props }: IFieldInput,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      className={twMerge(
        clsx(
          'w-full rounded-lg bg-neutral-100 px-3 py-2 mt-2 text-gray-500 outline-none border disabled:text-disabledText',
          {
            'border-red-500': error,
          },
        ),
        className,
      )}
      {...props}
      ref={ref}
    />
  )
}

const FieldInput = forwardRef(CustomInput)
export default FieldInput
