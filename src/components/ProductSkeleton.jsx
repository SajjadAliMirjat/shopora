export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white" aria-hidden="true">
      <div className="skeleton aspect-square" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton h-6 w-20 rounded" />
          <div className="skeleton h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ProductSkeletonGrid({ count = 8, className = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }) {
  return (
    <div className={`grid gap-5 ${className}`} role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
