import Header from '@/components/ui/Header'
import Carousel from '@/components/ui/Carousel'
import ProductList from '@/components/ProductList'
import CategoryFilter from '@/components/ui/Home/CategoryFilter'
import Advantages from '@/components/ui/Home/Advantages'
import Footer from '@/components/ui/Footer'
import dynamic from 'next/dynamic'

const PromoBig = dynamic(() => import('@/components/ui/Promo/PromoBig'), {
  ssr: false,
})

export default function Home() {
  return (
    <section className="bg-white">
      <Header.Client />
      <Carousel />
      <ProductList
        title="Produtos em Destaque"
        query={{
          orderBy: 'mostViews',
          limit: 10,
        }}
      />
      <div className="h-32 border-b" />
      <CategoryFilter title="Pesquise por Categoria" />
      <ProductList
        title="Recém adicionados"
        query={{
          orderBy: 'updatedAt',
          limit: 7,
        }}
      />
      <div className="h-32 border-b" />
      <PromoBig />
      <ProductList
        title="Produtos para a sua saúde"
        query={{
          category: 'Saúde',
          limit: 8,
        }}
      />
      <Advantages />
      <Footer />
    </section>
  )
}
