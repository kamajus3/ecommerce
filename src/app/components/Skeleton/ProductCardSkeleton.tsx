export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-gray-300 rounded-md">
      <div className="w-80 h-80 group-hover:opacity-75  max-lg:h-64 max-lg:w-64" />
      <div className="w-80 max-lg:w-64 mt-4 flex flex-wrap flex-col" />
    </div>
  )
}
