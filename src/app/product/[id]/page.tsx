import Header from '@/app/components/Header'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import ProductList from '@/app/components/ProductList'
import { FileImage } from 'lucide-react'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import PostAction from './action'
import { getProduct } from '@/lib/firebase/database'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  return new Promise((resolve) => {
    getProduct(params.id)
      .then((data) => {
        resolve({
          title: data.name,
          description: data.description.slice(0, 100) + '...',
          openGraph: {
            type: 'article',
            title: data.name,
            description: data.description,
            siteName: 'Racius Care',
            images: data.photo,
          },
        })
      })
      .catch(() => {
        resolve({
          title: `Artigo não encontrado.`,
        })
      })
  })
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)
  const money = useMoneyFormat()

  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <div className="container mx-auto py-8 flex items-center justify-center flex-wrap">
        <div className="bg-white p-8 rounded-lg flex items-center justify-center flex-wrap gap-x-16">
          <div
            className="w-full sm:w-80 h-80 relative select-none"
            draggable={false}
          >
            {product ? (
              <Image
                src={product.photo}
                alt={product.name}
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
            <span className="text-gray-600 font-medium">
              {product.category}
            </span>
            <h2 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.description}</p>
            <span className="block mt-2 text-xl font-semibold text-gray-700">
              {money.format(product.price)}
            </span>
            <PostAction {...product} id={params.id} />
          </div>
        </div>
      </div>
      <ProductList
        title="Produtos relacionados"
        query={{
          category: product.category,
          limit: 15,
        }}
      />
      <Footer />
    </section>
  )
}
