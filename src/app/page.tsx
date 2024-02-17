import Header from './components/Header'
import Carousel from './components/Carousel'
import ProductList from './components/ProductList'
import CategoryFilter from './components/Home/CategoryFilter'
import Promo from './components/Promo'
import Advantages from './components/Home/Advantages'
import Footer from './components/Footer'

export default function Home() {
  return (
    <section className="bg-white overflow-hidden">
      <Header />
      <Carousel />
      <ProductList title="Produtos em Destaque" />
      <div className="h-32 border-b" />
      <CategoryFilter title="Pesquise por Categoria" />
      <ProductList title="Recém adicionados" />
      <div className="h-32 border-b" />
      <Promo.Big serverTime={new Date('2024-02-17T14:50:30Z')} />
      <ProductList title="Produtos mais vendidos" />
      <Advantages />
      <Footer />
    </section>
  )
}
