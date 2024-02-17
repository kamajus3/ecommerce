import { User } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

const DropdownMenu = () => {
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
    <div className="relative" ref={dropdownRef}>
      <button
        className="inline-flex justify-center w-full border border-gray-300 shadow-sm p-2 rounded-full bg-red-500 text-sm font-medium text-gray-700 hover:brightness-75 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        id="options-menu"
        aria-haspopup="true"
        aria-expanded="true"
        onClick={toggleMenu}
      >
        <User color="#fff" size={27} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
          <div className="py-1">
            <span className="block text-sm px-4 py-2 text-gray-800 border-b">
              Logado com <strong>tom@example.com</strong>
            </span>
            <a
              href="#"
              className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Definições da conta
            </a>
            <a
              href="#"
              className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Terminar sessão
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
