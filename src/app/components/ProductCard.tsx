import Image from 'next/image'

interface Product {
  id: number
  name: string
  href: string
  imageSrc: string
  imageAlt: string
  price: string
  category: string
}

export default function ProductCard(product: Product) {
  return (
    <div>
      <div className="w-80 h-80 rounded-md group-hover:opacity-75  max-lg:h-64 max-lg:w-64">
        <div className="w-full h-full relative">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            objectFit="cover"
            objectPosition="center"
            fill
          />
        </div>
      </div>
      <div className="w-80 max-lg:w-64 mt-4 flex flex-col">
        <div className="w-full flex justify-between">
          <p className="text-sm text-gray-700">
            <a href={product.href}>{product.name}</a>
          </p>
          <p className="text-sm font-medium text-gray-900">{product.price}</p>
        </div>
        <p className="mt-1 text-left text-sm text-gray-500">
          {product.category}
        </p>
      </div>
    </div>
  )
}
