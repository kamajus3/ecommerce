import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

function LoadingState() {
  return (
    <button>
      <div
        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      />
    </button>
  )
}

interface IButtonVariant extends ButtonHTMLAttributes<HTMLElement> {
  loading?: boolean
}

function PrimaryButton({
  children,
  disabled,
  loading,
  className,
  ...props
}: IButtonVariant) {
  return (
    <button
      className={clsx(
        `flex justify-center items-center gap-2 bg-main rounded-md px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:brightness-50 ${className}`,
        {
          'transition-all hover:brightness-75 active:scale-90': !disabled,
        },
      )}
      {...props}
      disabled={disabled}
    >
      {!loading && children}
      {loading && <LoadingState />}
    </button>
  )
}

function NoBackgroundButton({
  children,
  disabled,
  loading,
  className,
  ...props
}: IButtonVariant) {
  return (
    <button
      className={clsx(
        `no-background text-gray-700 p-1 flex justify-center items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold disabled:text-disabledText disabled:cursor-not-allowed ${className}`,
        {
          'hover:brightness-75 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ring-offset-2 focus:ring-offset-gray-100':
            !disabled,
        },
      )}
      {...props}
      disabled={disabled}
    >
      {!loading && children}
      {loading && <LoadingState />}
    </button>
  )
}

interface IButton extends ButtonHTMLAttributes<HTMLElement> {
  variant?: 'default' | 'no-background'
  loading?: boolean
}

export default function Button({ variant = 'default', ...props }: IButton) {
  if (variant === 'default') {
    return <PrimaryButton {...props} />
  }

  if (variant === 'no-background') {
    return <NoBackgroundButton {...props} />
  }
}
