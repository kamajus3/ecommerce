'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import products from '@/assets/data/products'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import ProductList from '@/app/components/ProductList'
import useCartStore from '@/store/CartStore'
import { FileImage, Minus, Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import useMoneyFormat from '@/hooks/useMoneyFormat'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const product = products.find((p) => p.id === id)
  const [quantity, setQuantity] = useState(1)
  const cartProducts = useCartStore((state) => state.products)

  const AddToCart = useCartStore((state) => state.addProduct)
  const removeFromCart = useCartStore((state) => state.removeProduct)

  const increaseQuantity = () => {
    setQuantity((quantity) => quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((quantity) => quantity - 1)
    }
  }

  const money = useMoneyFormat()

  return (
    <section className="bg-white overflow-hidden">
      <Header />
      <div className="container mx-auto py-8 flex items-center justify-center flex-wrap">
        <div className="bg-white p-8 rounded-lg flex items-center justify-center flex-wrap gap-x-16">
          <div className="w-full sm:w-80 h-80 relative select-none" draggable={false}>
            {product ? (
              <Image
                src={product?.photo}
                alt={product?.name}
                objectFit="cover"
                objectPosition="center"
                draggable={false}
                className="select-none"
                fill
              />
            ) : (
              <div role="status" className="h-full w-full animate-pulse">
                <div className="flex items-center justify-center h-full mb-4 bg-gray-700">
                  <FileImage size={40} color="#f5f5f5" />
                </div>
                <span className="sr-only">Processando...</span>
              </div>
            )}
          </div>
          <div className="mt-4 sm:w-[30%] w-full flex flex-col items-start justify-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {product?.name}
            </h2>
            <p className="text-gray-600">{product?.description}</p>
            <span className="block mt-2 text-xl font-semibold text-gray-700">
              {money.format(product?.price ? product.price : 0)}
            </span>
            <div className="flex mt-4">
              <button
                className="bg-red-500 h-12 w-12"
                onClick={decreaseQuantity}
              >
                -
              </button>
              <input
                className="w-16 h-12 text-center bg-gray-100 text-black outline-none border-b border-t"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <button
                className="bg-red-500 h-12 w-12"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
            {cartProducts.find((p) => p.id === product?.id) ? (
              <button
                onClick={() => {
                  if (product?.id) {
                    removeFromCart(product?.id)
                    setQuantity(1)
                  }
                }}
                className="mt-4 bg-red-500 text-white p-4 hover:brightness-90 focus:outline-none font-medium active:scale-75 flex items-center justify-center gap-2"
              >
                <Minus size={15} /> Remover do carrinho
              </button>
            ) : (
              <button
                onClick={() => {
                  if (product?.id) {
                    AddToCart({
                      ...product,
                      quantity,
                    })
                  }
                }}
                className="mt-4 bg-main text-white p-4 hover:brightness-90 focus:outline-none font-medium active:scale-75 flex items-center justify-center gap-2"
              >
                <Plus size={15} /> Adicionar ao carrinho
              </button>
            )}
          </div>
        </div>
      </div>
      <ProductList title="Produtos relacionados" />
      <Footer />
    </section>
  )
}
