/**
 * SkeletonCard.jsx
 * Shimmer placeholder for product cards while WooCommerce data loads.
 */

export default function SkeletonCard() {
  return (
    <div className="block">
      {/* Image area */}
      <div className="skeleton aspect-[3/4] w-full" />
      {/* Text rows */}
      <div className="mt-2 space-y-1.5">
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}

/**
 * SkeletonGrid.jsx
 * A full grid of skeleton cards for the shop/collections listing pages.
 */
export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
