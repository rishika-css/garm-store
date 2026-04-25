/**
 * ProductPage.jsx
 * Single product detail page — mirrors product.pdf design.
 * Features:
 *  - Image gallery (thumbnails left, main image centre)
 *  - Product info right: name, price, colour swatches, size picker, add to bag
 *  - Collapsible sections: Details / Reviews / Delivery / Returns
 *  - "You May Also Like" grid at the bottom
 *
 * Route: /product/:slug
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useProducts, normaliseProduct } from '../hooks/useWooCommerce';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

// ─── Chevron icon ─────────────────────────────────────────────────
function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Collapsible accordion row ───────────────────────────────────
function AccordionRow({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-garm-light-gray">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="label-sm">{label}</span>
        <ChevronIcon open={open} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <div className="text-sm text-garm-gray leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ─── Image gallery ────────────────────────────────────────────────
function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return <div className="aspect-[3/4] bg-garm-cream" />;
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnail strip */}
      <div className="flex flex-col gap-2 w-16 shrink-0">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`aspect-square bg-garm-cream overflow-hidden border transition-all duration-200 ${
              active === i ? 'border-garm-black' : 'border-transparent opacity-60'
            }`}
          >
            <img src={src} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 img-zoom aspect-[3/4] bg-garm-cream relative overflow-hidden">
        <img
          src={images[active]}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive(v => (v - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setActive(v => (v + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 transition-colors"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Size picker ─────────────────────────────────────────────────
const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function SizePicker({ selected, onSelect }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="label-sm">SIZES</span>
        <button className="text-xs text-garm-gray underline underline-offset-4 hover:text-garm-black transition-colors">
          SIZE CHART
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {STANDARD_SIZES.map(sz => (
          <button
            key={sz}
            onClick={() => onSelect(sz)}
            className={`
              border px-4 py-2 text-xs tracking-widest transition-all duration-200
              ${selected === sz
                ? 'bg-garm-black text-garm-white border-garm-black'
                : 'border-garm-light-gray hover:border-garm-black'
              }
            `}
          >
            {sz}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Colour swatches ─────────────────────────────────────────────
function ColorSwatches({ images }) {
  // In WooCommerce, variations would give us colour options.
  // For now render a swatch based on the first image thumbnail.
  if (!images || images.length === 0) return null;

  return (
    <div>
      <span className="label-sm block mb-3">COLOURS</span>
      <div className="flex gap-2">
        <button className="w-10 h-10 border-2 border-garm-black overflow-hidden">
          <img src={images[0]} alt="colour swatch" className="w-full h-full object-cover" />
        </button>
      </div>
    </div>
  );
}

// ─── Add to bag button with animation ────────────────────────────
function AddToBagButton({ onClick, disabled }) {
  const [added, setAdded] = useState(false);

  const handle = () => {
    if (disabled) return;
    onClick();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handle}
      disabled={disabled}
      className={`
        w-full py-4 label-sm tracking-widest transition-all duration-300
        ${disabled
          ? 'bg-garm-light-gray text-garm-gray cursor-not-allowed'
          : added
          ? 'bg-garm-orange text-white'
          : 'bg-garm-black text-white hover:bg-garm-orange'
        }
      `}
    >
      {disabled ? 'SOLD OUT' : added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
    </button>
  );
}

// ─── Product skeleton ─────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="px-4 md:px-8 py-8 grid md:grid-cols-2 gap-8 md:gap-16">
      <div className="skeleton aspect-[3/4]" />
      <div className="space-y-4 pt-4">
        <div className="skeleton h-8 w-3/4" />
        <div className="skeleton h-6 w-1/4" />
        <div className="skeleton h-px w-full" />
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-14 w-full mt-8" />
      </div>
    </div>
  );
}

// ─── You May Also Like ────────────────────────────────────────────
function YouMayAlsoLike({ currentId }) {
  const { products: raw } = useProducts({ per_page: 8, orderby: 'rand' });
  const products = raw
    .map(normaliseProduct)
    .filter(p => p.id !== currentId)
    .slice(0, 8);

  if (products.length === 0) return null;

  return (
    <section className="px-4 md:px-8 py-16 border-t border-garm-light-gray">
      <h2 className="text-xl font-bold tracking-tight mb-8 text-center">YOU MAY ALSO LIKE</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

// ─── Main page ───────────────────────────────────────────────────
export default function ProductPage() {
  const { slug }  = useParams();
  const { product: raw, loading, error } = useProduct(slug);
  const product   = normaliseProduct(raw);

  const { addItem, toggleCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError,    setSizeError]    = useState(false);

  if (loading) return <ProductSkeleton />;

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="label-sm text-garm-gray">PRODUCT NOT FOUND</p>
        <Link to="/shop" className="btn-outline">BACK TO SHOP</Link>
      </div>
    );
  }

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    addItem({
      id:    product.id,
      name:  product.name,
      price: product.salePrice ?? product.price,
      image: product.image,
      size:  selectedSize,
    });
    toggleCart();
  };

  return (
    <div>
      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div className="px-4 md:px-8 py-4">
        <p className="label-sm text-garm-gray">
          <Link to="/" className="hover:text-garm-black">HOME</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-garm-black">SHOP</Link>
          <span className="mx-2">/</span>
          <span className="text-garm-black">{product.name.toUpperCase()}</span>
        </p>
      </div>

      {/* ── Main product layout ──────────────────────────────────── */}
      <div className="px-4 md:px-8 pb-12 grid md:grid-cols-[1fr_420px] gap-8 md:gap-16 items-start">

        {/* Gallery */}
        <ImageGallery images={product.images} name={product.name} />

        {/* Info panel */}
        <div className="md:sticky md:top-20 space-y-6 fade-up">

          {/* Name + price */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              {product.salePrice ? (
                <>
                  <span className="text-lg font-medium text-garm-orange">{product.salePrice} AUD</span>
                  <span className="text-sm text-garm-gray line-through">{product.regularPrice} AUD</span>
                </>
              ) : (
                <span className="text-lg font-medium">{product.price} AUD</span>
              )}
            </div>
          </div>

          <div className="divider" />

          {/* Colour swatches */}
          <ColorSwatches images={product.images} />

          {/* Size picker */}
          <SizePicker selected={selectedSize} onSelect={s => { setSelectedSize(s); setSizeError(false); }} />

          {/* Size error message */}
          {sizeError && (
            <p className="text-xs text-garm-orange animate-pulse">PLEASE SELECT A SIZE</p>
          )}

          {/* Delivery note */}
          <p className="text-xs text-garm-gray">
            FREE 1–2 day delivery on 5k+ pincodes
          </p>

          {/* Add to bag */}
          <AddToBagButton onClick={handleAddToBag} disabled={!product.inStock} />

          {/* Accordions */}
          <div>
            <AccordionRow label="DETAILS">
              <div
                dangerouslySetInnerHTML={{ __html: product.shortDesc || product.description || 'No details available.' }}
              />
            </AccordionRow>
            <AccordionRow label="REVIEWS">
              <p>Customer reviews will appear here once integrated with the WooCommerce reviews API.</p>
            </AccordionRow>
            <AccordionRow label="DELIVERY">
              <p>Free 1–2 day delivery on 5,000+ pincodes. Standard delivery 3–5 business days. Express options available at checkout.</p>
            </AccordionRow>
            <AccordionRow label="RETURNS">
              <p>Free returns within 30 days of purchase. Items must be unworn with original tags. See our full returns policy for details.</p>
            </AccordionRow>
          </div>
        </div>
      </div>

      {/* ── You May Also Like ─────────────────────────────────────── */}
      <YouMayAlsoLike currentId={product.id} />
    </div>
  );
}
