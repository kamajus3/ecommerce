import { ForwardedRef, forwardRef, TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'
import { FieldError } from 'react-hook-form'

interface IFieldTextArea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error: FieldError | undefined
}

function CustomTextArea(
  { error, ...props }: IFieldTextArea,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-lg h-40 resize-none bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border',
        {
          'border-red-500': error,
        },
      )}
      {...props}
      ref={ref}
    />
  )
}

const IFieldTextArea = forwardRef(CustomTextArea)
export default IFieldTextArea
