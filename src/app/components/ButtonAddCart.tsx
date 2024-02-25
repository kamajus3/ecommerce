import useCartStore from '@/store/CartStore'

inteface ButtonAddCart

export default function ButtonAddCart() {
  const cartProducts = useCartStore((state) => state.products)

  const AddToCart = useCartStore((state) => state.addProduct)
  const removeFromCart = useCartStore((state) => state.removeProduct)

  return (
    <>
      {cartProducts.find((p) => p.id === product?.id) ? (
        <button
          onClick={() => {
            if (product?.id) {
              removeFromCart(product?.id)
              setQuantity(1)
            }
          }}
          className="mt-4 bg-red-500 text-white p-4 hover:brightness-90 focus:outline-none font-medium active:scale-75 flex items-center justify-center gap-2"
        >
          <Minus size={15} /> Remover do carrinho
        </button>
      ) : (
        <button
          onClick={() => {
            if (product?.id) {
              AddToCart({
                ...product,
                quantity,
              })
            }
          }}
          className="mt-4 bg-main text-white p-4 hover:brightness-90 focus:outline-none font-medium active:scale-75 flex items-center justify-center gap-2"
        >
          <Plus size={15} /> Adicionar ao carrinho
        </button>
      )}
    </>
  )
}
