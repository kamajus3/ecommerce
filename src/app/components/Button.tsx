import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLElement> {
  loading?: boolean
}

export default function Button(props: ButtonProps) {
  return (
    <button
      className="flex items-center gap-2 bg-main rounded-md px-3 py-2 text-sm font-semibold text-white transition-all hover:brightness-75 active:scale-90"
      {...props}
    >
      {props.loading ? (
        <div
          className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        />
      ) : (
        <span className="text-white">{props.children}</span>
      )}
    </button>
  )
}
