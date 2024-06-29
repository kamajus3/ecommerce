'use client'

import { useAuth } from '@/hooks/useAuth'
import clsx from 'clsx'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useRef, useEffect, ReactNode } from 'react'

export default function Avatar({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    if (user) {
      setIsOpen(!isOpen)
    } else {
      router.push('/login')
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative bg-white" ref={dropdownRef}>
      <button
        className={clsx(
          'inline-flex justify-center w-full border shadow-sm p-2 rounded-full bg-main text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100',
          {
            'bg-red-500': !user,
          },
        )}
        id="options-menu"
        aria-haspopup="true"
        aria-expanded="true"
        onClick={toggleMenu}
      >
        <User color="#fff" size={27} />
      </button>

      {isOpen && (
        <div className="absolute z-[999] min-w-32 right-0 mt-2 bg-white border rounded-md shadow-lg">
          <div className="pt-1">{children}</div>
        </div>
      )}
    </div>
  )
}
