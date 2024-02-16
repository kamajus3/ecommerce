import Header from './components/Header'
import Carousel from './components/Carousel'
import ProductList from './components/ProductList'
import CategoryFilter from './components/Home/CategoryFilter'
import Promo from './components/Home/Promo'

export default function Home() {
  return (
    <section className="bg-white overflow-hidden">
      <Header />
      <Carousel />
      <ProductList title="Produtos em Destaque" />
      <div className="h-32 border-b" />
      <CategoryFilter title="Pesquise por Categoria" />
      <ProductList title="Produtos mais vendidos" />
      <div className="h-32 border-b" />
      <Promo />
    </section>
  )
}
