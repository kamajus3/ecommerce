'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import products from '@/assets/data/products'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import ProductList from '@/app/components/ProductList'

export default function ProductPage() {
  const product = products[0]
  const [quantity, setQuantity] = useState(1)

  const increaseQuantity = () => {
    setQuantity((quantity) => quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((quantity) => quantity - 1)
    }
  }

  return (
    <section className="bg-white overflow-hidden">
      <Header />
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg flex items-center justify-center gap-x-16">
          <div className="w-80 h-80 relative">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              objectFit="cover"
              objectPosition="center"
              fill
            />
          </div>
          <div className="mt-4 w-[30%] flex flex-col items-start justify-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.description}</p>
            <span className="block mt-2 text-xl font-semibold text-gray-700">
              {product.price}
            </span>
            <div className="flex mt-4">
              <button
                className="bg-red-500 h-12 w-12 rounded-l-md"
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
                className="bg-red-500 h-12 w-12 rounded-r"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
            <button className="mt-4 bg-main text-white p-4 rounded-md hover:brightness-90 focus:outline-none font-medium active:scale-75">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
      <ProductList title="Produtos relacionados" />
      <Footer />
    </section>
  )
}
