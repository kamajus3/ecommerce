import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { formatPhotoUrl } from '@/functions/format'
import { ProductRepository } from '@/repositories/product.repository'

import Product from '../components/Product'

const productRepository = new ProductRepository()

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string }
}): Promise<Metadata> {
  const t = await getTranslations('product')
  const product = await productRepository.findById(id)

  if (product) {
    return {
      title: product.name,
      description:
        product.description.length <= 100
          ? product.description
          : `${product.description.slice(0, 100)}...`,
      openGraph: {
        type: 'article',
        title: product.name,
        description: product.description,
        siteName: 'Poubelle',
        images: formatPhotoUrl(product.photo, product.updatedAt),
      },
    }
  } else {
    return {
      title: t('notFound'),
    }
  }
}

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const product = await productRepository.findById(id)

  if (!product) {
    return notFound()
  }

  return <Product {...product} />
}
