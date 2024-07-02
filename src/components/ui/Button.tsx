import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLElement> {
  loading?: boolean
}

export default function Button(props: ButtonProps) {
  const { className, loading, ...rest } = props
  return (
    <button
      className={clsx(
        `flex justify-center items-center gap-2 bg-main rounded-md px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:brightness-50 ${className}`,
        {
          'transition-all hover:brightness-75 active:scale-90': !props.disabled,
        },
      )}
      {...rest}
    >
      {loading ? (
        <div
          className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        />
      ) : (
        <div className="text-white flex justify-center items-center gap-2">
          {props.children}
        </div>
      )}
    </button>
  )
}
