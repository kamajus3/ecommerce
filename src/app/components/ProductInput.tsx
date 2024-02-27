'use client'

import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getProducts } from '@/lib/firebase/database'
import { ProductItem } from '@/@types'
import { Search } from 'lucide-react'

interface ProductInputProps {
  inputProps?: HTMLAttributes<HTMLInputElement>
}

const schema = z.object({
  searchValue: z.string().min(1),
})

interface FormData {
  searchValue: string
}

export default function ProductInput(props: ProductInputProps) {
  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const [productData, setProductData] = useState<Record<string, ProductItem>>(
    {},
  )
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const searchValue = watch('searchValue')

  useEffect(() => {
    function unsubscribed() {
      if (searchValue && searchValue?.length > 0) {
        getProducts({
          search: searchValue,
          limit: 5,
        }).then((products) => {
          if (Object.entries(products).length > 0) {
            setIsOpen(true)
          } else {
            setIsOpen(false)
          }
          setProductData(products)
        })
      } else {
        setProductData({})
      }
    }

    unsubscribed()
  }, [searchValue])

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 border flex items-center gap-2">
        <Search size={15} color="#6B7280" />

        <input
          type="text"
          placeholder="Pesquisar producto"
          {...props.inputProps}
          {...register('searchValue')}
          className="w-[90%] placeholder:text-sm text-gray-500 bg-transparent outline-none"
        />
      </div>

      {isOpen && (
        <div className="absolute top-14 w-full bg-white border rounded-md shadow-lg z-10">
          {Object.entries(productData).map(([id, product]) => (
            <div
              key={id}
              className="p-3 bg-white text-sm text-gray-800 hover:bg-gray-200 cursor-pointer select-none"
            >
              {product.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
