import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

interface FieldErrorProps {
  error:
    | FieldError
    | Merge<
        FieldError,
        (
          | Merge<FieldError, FieldErrorsImpl<{ id: string; name: string }>>
          | undefined
        )[]
      >
    | undefined
}

export default function FieldError(props: FieldErrorProps) {
  return (
    <div>
      {props.error && (
        <p className="text-red-500 font-medium mt-1">{props.error.message}</p>
      )}
    </div>
  )
}
