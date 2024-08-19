'use client'

import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { IProduct, IProductInput as IProductInputObject } from '@/@types'
import { ProductRepository } from '@/repositories/product.repository'
import { zodResolver } from '@hookform/resolvers/zod'

interface IProductInput {
  products: IProductInputObject[] | undefined | null
  campaignId?: string
  appendProduct: (product: IProductInputObject) => void
  removeProduct: (id: string) => void
  error?: boolean
  inputProps?: HTMLAttributes<HTMLInputElement>
}

const schema = z.object({
  searchValue: z.string().min(1),
})

interface IFormData {
  searchValue: string
}

export default function ProductInput(props: IProductInput) {
  const { register, watch, reset } = useForm<IFormData>({
    resolver: zodResolver(schema),
  })

  const [productData, setProductData] = useState<IProduct[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const productRepository = useMemo(() => new ProductRepository(), [])

  const t = useTranslations('structure')

  function handleClick(product: IProduct) {
    if (props.products) {
      reset({
        searchValue: '',
      })
      setIsOpen(false)

      const isInProducts = props.products.find((p) => p.id === product.id)

      if (!isInProducts) {
        props.appendProduct({
          id: product.id,
          name: product.name,
        })
      } else {
        props.removeProduct(product.id)
      }
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

  const searchValue = watch('searchValue')

  useEffect(() => {
    function fetchData() {
      if (searchValue && searchValue.length > 0) {
        productRepository
          .findByName({
            search: searchValue,
            limit: 5,
          })
          .then((products) => {
            if (products.length > 0) {
              setIsOpen(true)
            } else {
              setIsOpen(false)
            }
            setProductData(products)
          })
      } else {
        setProductData([])
      }
    }

    fetchData()
  }, [searchValue, props.campaignId, productRepository])

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-full rounded-lg bg-neutral-100 mt-2 px-3 py-2 border flex items-center gap-2 ${
          props.error && 'border-red-500'
        }`}
      >
        <Search size={15} color="#6B7280" />

        <input
          type="text"
          placeholder={t('structure.client.search')}
          {...props.inputProps}
          {...register('searchValue')}
          className="w-[90%] placeholder:text-sm text-gray-500 bg-transparent outline-none"
        />
      </div>

      {isOpen && (
        <div className="absolute top-14 w-full bg-white border rounded-md shadow-lg z-10 flex flex-col">
          {productData.length > 0 &&
            productData.map((product) => (
              <button
                key={product.id}
                disabled={
                  product.campaign?.id !== undefined &&
                  product.campaign?.id !== props.campaignId
                }
                className="bg-white text-gray-800 enabled:hover:bg-gray-200 disabled:text-gray-400"
                onClick={() => {
                  handleClick(product)
                }}
              >
                <span className="flex items-center justify-between relative p-3 text-sm select-none">
                  {product.name}
                  {props.products &&
                    props.products.find((p) => p.id === product.id) && (
                      <Check className="left-4" color="#000" size={15} />
                    )}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
