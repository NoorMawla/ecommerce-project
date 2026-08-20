export function Skeleton({ className = "" }: { className?: string }) {
    return (
      <div
        className={`animate-pulse rounded-lg bg-surface-2 ${className}`}
        aria-hidden="true"
      />
    );
  }
  
  export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
      <div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-label="Loading products"
        aria-busy="true"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <Skeleton className="aspect-square rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }