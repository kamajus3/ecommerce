import { ForwardedRef, TextareaHTMLAttributes, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

interface FieldTextArea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error: FieldError | undefined
}

function CustomTextArea(
  props: FieldTextArea,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <textarea
      className={`w-full rounded-lg h-40 resize-none bg-neutral-100 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${props.error && 'border-red-500'}`}
      {...props}
      ref={ref}
    />
  )
}

const FieldTextArea = forwardRef(CustomTextArea)
export default FieldTextArea
