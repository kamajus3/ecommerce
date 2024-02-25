export default function ButtonAmout() {
  return (
    <div className="flex mt-4">
      <button className="bg-red-500 h-12 w-12" onClick={decreaseQuantity}>
        -
      </button>
      <input
        className="w-16 h-12 text-center bg-gray-100 text-black outline-none border-b border-t"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button className="bg-red-500 h-12 w-12" onClick={increaseQuantity}>
        +
      </button>
    </div>
  )
}
