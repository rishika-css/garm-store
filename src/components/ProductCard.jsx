/**
 * ProductCard.jsx
 * Displays a single product thumbnail in the grid.
 * Used on the Shop / Collections pages.
 *
 * Props:
 *  product  – normalised product object (see useWooCommerce.js → normaliseProduct)
 *  priority – boolean; if true renders a larger image (above-the-fold optimisation)
 */

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// ─── Quick-add icon (bag +) ───────────────────────────────────────
function QuickAddIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9"  y1="14" x2="15" y2="14" />
    </svg>
  );
}

export default function ProductCard({ product, priority = false }) {
  const { addItem } = useCart();

  if (!product) return null;

  const { id, slug, name, price, salePrice, image, inStock } = product;

  // Quick-add defaults to size M — user can change on product page
  const handleQuickAdd = (e) => {
    e.preventDefault(); // don't navigate to product page
    addItem({ id, name, price: salePrice ?? price, image, size: 'M' });
  };

  return (
    <Link to={`/product/${slug}`} className="product-card group block">
      {/* ── Image wrapper with hover zoom ──────────────────────── */}
      <div className="img-zoom relative bg-garm-cream aspect-[3/4] w-full">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          /* Placeholder when no image available */
          <div className="w-full h-full bg-garm-light-gray" />
        )}

        {/* Sale badge */}
        {salePrice && (
          <span className="absolute top-3 left-3 bg-garm-orange text-white label-sm px-2 py-1 text-[10px]">
            SALE
          </span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="label-sm text-garm-gray">SOLD OUT</span>
          </div>
        )}

        {/* Quick-add button — appears on hover */}
        {inStock && (
          <button
            onClick={handleQuickAdd}
            className="
              absolute bottom-3 right-3
              bg-garm-black text-garm-white
              p-2.5 rounded-none
              opacity-0 group-hover:opacity-100
              transition-all duration-200
              hover:bg-garm-orange
            "
            aria-label={`Quick add ${name} to bag`}
          >
            <QuickAddIcon />
          </button>
        )}
      </div>

      {/* ── Card info row ─────────────────────────────────────── */}
      <div className="card-info">
        <p className="text-xs font-medium tracking-wide uppercase truncate max-w-[70%]">{name}</p>
        <div className="flex items-center gap-2 shrink-0">
          {salePrice ? (
            <>
              <span className="text-xs text-garm-orange font-medium">{salePrice} AUD</span>
              <span className="text-xs text-garm-gray line-through">{price} AUD</span>
            </>
          ) : (
            <span className="text-xs font-medium">{price} AUD</span>
          )}
        </div>
      </div>
    </Link>
  );
}
