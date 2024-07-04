import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  SetStateAction,
} from 'react'
import clsx from 'clsx'
import { FieldError } from 'react-hook-form'

interface IFieldDropZone extends InputHTMLAttributes<HTMLInputElement> {
  supportedImageResolution?: number[]
  photoPreview: string | null
  setImageDimension?: Dispatch<SetStateAction<number[]>>
  error: FieldError | undefined
}

function CustomFileInput(
  props: IFieldDropZone,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const img = new Image()
  img.src = props.photoPreview || ''

  img.onload = () => {
    if (props.setImageDimension) {
      props.setImageDimension([img.width, img.height])
    }
  }

  return (
    <label
      htmlFor="dropzone-file"
      style={{
        backgroundImage: `url(${props.photoPreview})`,
        backgroundSize: 'cover',
      }}
      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:brightness-95 ${props.error && 'border-red-500 bg-red-100'}`}
    >
      <div
        className={clsx('flex flex-col items-center justify-center pt-5 pb-6', {
          hidden: props.photoPreview,
        })}
      >
        <svg
          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-2 text-sm text-gray-500 text-center">
          <span className="font-semibold">Clique para fazer upload</span>
          {props.supportedImageResolution && (
            <div className="font-medium">
              <br />({props.supportedImageResolution[0]}
              {' x '}
              {props.supportedImageResolution[1]})
            </div>
          )}
          <br />
          ou arrasta e larga
        </p>
      </div>
      <input
        type="file"
        id="dropzone-file"
        ref={ref}
        {...props}
        className="hidden"
        accept="image/*"
      />
    </label>
  )
}

const FieldDropZone = forwardRef(CustomFileInput)
export default FieldDropZone
