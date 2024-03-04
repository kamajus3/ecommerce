export default function ProductCardSkeleton() {
  return (
    <div className="w-72 animate-pulse bg-gray-300 rounded-md">
      <div className="w-full h-72 group-hover:opacity-75  max-lg:h-64 max-lg:w-64" />
      <div className="max-lg:w-64 mt-4 flex flex-wrap flex-col" />
    </div>
  )
}
