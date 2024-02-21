import Header from './components/Header'
import Carousel from './components/Carousel'
import ProductList from './components/ProductList'
import CategoryFilter from './components/Home/CategoryFilter'
import Advantages from './components/Home/Advantages'
import Footer from './components/Footer'
import dynamic from 'next/dynamic'

const Promo = dynamic(() => import('./components/Promo/PromoBig'), {
  ssr: false,
})

export default function Home() {
  return (
    <section className="bg-white overflow-hidden">
      <Header.Client />
      <Carousel />
      <ProductList title="Produtos em Destaque" />
      <div className="h-32 border-b" />
      <CategoryFilter title="Pesquise por Categoria" />
      <ProductList title="Recém adicionados" />
      <div className="h-32 border-b" />
      <Promo
        serverTime={new Date(new Date().setDate(new Date().getDate() + 2))}
      />
      <ProductList title="Produtos mais vendidos" />
      <Advantages />
      <Footer />
    </section>
  )
}
