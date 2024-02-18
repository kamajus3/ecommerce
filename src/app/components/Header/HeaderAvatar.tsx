import { useAuth } from '@/hooks/useAuth'
import clsx from 'clsx'
import { User } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

export default function HeaderAvatar() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
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
          'inline-flex justify-center w-full border shadow-sm p-2 rounded-full bg-green-400 text-sm font-medium text-gray-700 hover:brightness-75 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100',
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
        <div className="absolute min-w-44 right-0 mt-2 bg-white border rounded-md shadow-lg z-10">
          <div className="py-1">
            {user && (
              <p className="text-sm px-4 py-2 text-gray-800 border-b">
                Logado em <strong>{user.email}</strong>
              </p>
            )}
            {user ? (
              <a
                href="/perfil"
                className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Definições da conta
              </a>
            ) : (
              <a
                href="/signin"
                className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Iniciar a sua sessão
              </a>
            )}
            {user && (
              <a
                href="/delivery"
                className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Meus pedidos
              </a>
            )}
            {user ? (
              <a
                href="/logout"
                className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Terminar sessão
              </a>
            ) : (
              <a
                href="/signup"
                className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Criar uma conta
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
