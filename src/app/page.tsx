import dynamic from 'next/dynamic'

import Carousel from '@/components/ui/Carousel'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import Advantages from '@/components/ui/Home/Advantages'
import CategoryFilter from '@/components/ui/Home/CategoryFilter'
import ProductList from '@/components/ui/ProductList'

const BigCampaign = dynamic(() => import('@/components/ui/Home/BigCampaign'), {
  ssr: false,
})

export default function Home() {
  return (
    <section className="bg-white">
      <Header.Client />
      <Carousel />
      <ProductList
        title="Em destaque"
        query={{
          orderBy: 'views',
          limit: 7,
        }}
      />
      <div className="h-32 border-b" />
      <CategoryFilter title="Filtrar por Categoria" />
      <ProductList
        title="Novidades da Semana"
        query={{
          orderBy: 'updatedAt',
          limit: 8,
        }}
      />
      <div className="h-32 border-b" />
      <BigCampaign />
      <ProductList
        title="Cuide da Sua Saúde"
        query={{
          filterBy: { category: 'Saúde' },
          limit: 8,
        }}
      />
      <ProductList
        title="Essenciais para Bebês"
        query={{
          filterBy: { category: 'Bebê' },
          limit: 8,
        }}
      />
      <ProductList
        title="Cuidados Pessoais"
        query={{
          filterBy: { category: 'Higiene Pessoal' },
          limit: 8,
        }}
      />
      <ProductList
        title="Controle de Pragas"
        query={{
          filterBy: { category: 'Inseticidas' },
          limit: 8,
        }}
      />
      <ProductList
        title="Alimentos Saudáveis"
        query={{
          filterBy: { category: 'Alimentação' },
          limit: 8,
        }}
      />
      <Advantages />
      <Footer />
    </section>
  )
}
