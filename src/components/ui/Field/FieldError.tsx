import {
  FieldError as FormFieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form'

interface IFieldError {
  error:
    | FormFieldError
    | Merge<
        FormFieldError,
        (
          | Merge<FormFieldError, FieldErrorsImpl<{ id: string; name: string }>>
          | undefined
        )[]
      >
    | undefined
}

export default function FieldError(props: IFieldError) {
  return (
    <div>
      {props.error && (
        <p className="text-red-500 font-medium mt-1">{props.error.message}</p>
      )}
    </div>
  )
}
