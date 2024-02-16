import { ButtonHTMLAttributes } from 'react'

export default function Button(props: ButtonHTMLAttributes<HTMLElement>) {
  return (
    <button
      className="flex items-center gap-2 bg-main px-12 py-4 text-xs font-medium text-white transition-all hover:brightness-75 active:scale-90"
      {...props}
    >
      {props.children}
    </button>
  )
}
