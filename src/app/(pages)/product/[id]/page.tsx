import Header from '@/app/components/Header'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import ProductList from '@/app/components/ProductList'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import PostAction from './action'
import { getProduct } from '@/lib/firebase/database'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  return new Promise((resolve) => {
    getProduct(params.id).then((data) => {
      if (data) {
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
      } else {
        resolve({
          title: `Produto não encontrado.`,
        })
      }
    })
  })
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)
  if (!product) notFound()
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
            {product && (
              <>
                {product.promotion?.reduction &&
                  product.promotion?.reduction !== 0 && (
                    <Link
                      href="#"
                      className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-red-500 text-white z-50 left-0 top-0"
                    >
                      Promoção: {`${product.promotion.reduction} %`}
                    </Link>
                  )}

                {product.promotion?.reduction &&
                  product.promotion?.reduction === 0 && (
                    <Link
                      href="#"
                      className="absolute h-10 flex items-center rounded-md text-sm font-semibold p-2 bg-green-500 text-white z-50 left-0 top-0"
                    >
                      Em campanha
                    </Link>
                  )}

                <Image
                  src={product.photo}
                  alt={product.name}
                  objectFit="cover"
                  objectPosition="center"
                  draggable={false}
                  className="select-none"
                  fill
                />
              </>
            )}
          </div>
          <div className="mt-4 sm:w-[30%] w-full flex flex-col items-start justify-center">
            <Link
              href={`/search/category?value=${product.category}`}
              className="text-gray-600 font-medium"
            >
              {product.category}
            </Link>
            <h2 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.description}</p>

            <span className="block mt-2 text-xl font-semibold text-gray-700">
              {product.promotion?.reduction &&
              product.promotion?.reduction !== 0
                ? money.format(
                    product.price -
                      product.price * (product.promotion.reduction / 100),
                  )
                : money.format(product.price)}
            </span>
            {product.promotion?.reduction &&
              product.promotion?.reduction !== 0 && (
                <span className="font-medium line-through text-gray-500 text-sm">
                  {money.format(product.price)}
                </span>
              )}
            <PostAction {...product} id={params.id} />
          </div>
        </div>
      </div>
      <ProductList
        title="Produtos relacionados"
        query={{
          category: product.category,
          except: params.id,
          limit: 15,
        }}
      />
      <div className="mb-4" />
      <Footer />
    </section>
  )
}
