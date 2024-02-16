import Header from './components/Header'
import Carousel from './components/Carousel'
import ProductList from './components/ProductList'

export default function Home() {
  return (
    <section className="bg-white overflow-hidden">
      <Header />
      <Carousel />
      <ProductList title="Produtos em Destaque" />
    </section>
  )
}
