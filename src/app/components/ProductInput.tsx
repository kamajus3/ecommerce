import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getProducts } from '@/lib/firebase/database'
import { ProductItem, ProductInputProps as ProductInputObject } from '@/@types'
import { Check, Search } from 'lucide-react'

interface ProductInputProps {
  products: ProductInputObject[]
  promotionId?: string
  appendProduct: (product: ProductInputObject) => void
  removeProduct: (id: string) => void
  error?: boolean
  inputProps?: HTMLAttributes<HTMLInputElement>
}

const schema = z.object({
  searchValue: z.string().min(1),
})

interface FormData {
  searchValue: string
}

export default function ProductInput(props: ProductInputProps) {
  const { register, watch, reset } = useForm<FormData>({
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
    function fetchData() {
      if (searchValue && searchValue.length > 0) {
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

    fetchData()
  }, [searchValue, props?.promotionId])

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
          placeholder="Pesquisar producto"
          {...props.inputProps}
          {...register('searchValue')}
          className="w-[90%] placeholder:text-sm text-gray-500 bg-transparent outline-none"
        />
      </div>

      {isOpen && (
        <div className="absolute top-14 w-full bg-white border rounded-md shadow-lg z-10">
          {Object.entries(productData).map(
            ([id, product]) =>
              (product.promotion?.id === props.promotionId ||
                product.promotion?.id === undefined) && (
                <div
                  key={id}
                  onClick={() => {
                    reset({
                      searchValue: '',
                    })
                    setIsOpen(false)

                    const isInProducts = props.products.find((p) => p.id === id)

                    if (!isInProducts) {
                      props.appendProduct({
                        id,
                        name: product.name,
                      })
                    } else {
                      props.removeProduct(id)
                    }
                  }}
                  className="flex items-center justify-between relative p-3 bg-white text-sm text-gray-800 hover:bg-gray-200 cursor-pointer select-none"
                >
                  {product.name}

                  {props.products.find((p) => p.id === id) && (
                    <Check className="left-4" color="#000" size={15} />
                  )}
                </div>
              ),
          )}
        </div>
      )}
    </div>
  )
}
