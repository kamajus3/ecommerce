import products from './products'

const adminProducts = products.map((product) => {
  return { ...product, quantity: Math.floor(Math.random() * 10 + 1) }
})

export default adminProducts
