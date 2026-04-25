/**
 * CollectionsPage.jsx
 * Grid of collection categories, each linking to a filtered shop page.
 * Uses the WooCommerce product categories endpoint.
 */

import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useWooCommerce';

function CollectionCard({ category }) {
  const imageUrl = category.image?.src || null;

  return (
    <Link
      to={`/shop?category=${category.id}`}
      className="group relative aspect-[3/4] overflow-hidden bg-garm-cream block img-zoom"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Gradient placeholder */
        <div className="w-full h-full bg-gradient-to-br from-garm-cream to-garm-light-gray" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-bold tracking-wide text-sm md:text-base leading-tight">
          {category.name.toUpperCase()}
        </p>
        {category.count > 0 && (
          <p className="text-white/60 text-xs mt-1 label-sm">
            {category.count} ITEMS
          </p>
        )}
      </div>
    </Link>
  );
}

// Skeleton for loading state
function CollectionSkeleton() {
  return <div className="skeleton aspect-[3/4]" />;
}

export default function CollectionsPage() {
  const { categories, loading } = useCategories();

  // Filter out uncategorised (id=0) and any parent categories if desired
  const filtered = categories.filter(c => c.id !== 0 && c.parent === 0);

  return (
    <div className="px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <p className="label-sm text-garm-gray mb-2">
          <Link to="/" className="hover:text-garm-black">HOME</Link>
          <span className="mx-2">/</span>
          COLLECTIONS
        </p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">COLLECTIONS</h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CollectionSkeleton key={i} />)
          : filtered.map(cat => <CollectionCard key={cat.id} category={cat} />)
        }
      </div>

      {!loading && filtered.length === 0 && (
        <div className="flex items-center justify-center h-64 text-garm-gray">
          <p className="label-sm">NO COLLECTIONS FOUND</p>
        </div>
      )}
    </div>
  );
}
