/**
 * ShopPage.jsx
 * The main product listing page — mirrors collections.pdf.
 * Features:
 *  - Left sidebar with collapsible filter groups
 *  - Top filter pills (All / New / Relaxed / Formal / etc.)
 *  - 4-column product grid
 *  - Sort dropdown
 *  - Pagination
 *
 * Route: /shop  (also used for /collections with different heading)
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts, normaliseProduct } from '../hooks/useWooCommerce';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';

// ─── Quick-filter pills (horizontal scroll row) ───────────────────
const QUICK_FILTERS = [
  { label: 'ALL',         value: '' },
  { label: 'NEW',         value: 'new' },
  { label: 'RELAXED',     value: 'relaxed' },
  { label: 'FORMAL',      value: 'formal' },
  { label: 'LINEN',       value: 'linen' },
  { label: 'SLIM',        value: 'slim' },
  { label: 'HALF SLEEVE', value: 'half-sleeve' },
  { label: 'LUXE',        value: 'luxe' },
  { label: 'PLUS SIZE',   value: 'plus-size' },
  { label: 'BLACK',       value: 'black' },
  { label: 'PLAIN',       value: 'plain' },
  { label: 'PRINTS',      value: 'prints' },
  { label: 'CORE LAB',    value: 'core-lab' },
  { label: 'CHECKS',      value: 'checks' },
  { label: 'DENIM',       value: 'denim' },
];

// ─── Sidebar filter section (collapsible) ────────────────────────
function FilterSection({ label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-garm-light-gray">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full py-3 label-sm text-left"
      >
        {label}
        <span className="text-lg leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="pb-4 pt-1">{children}</div>}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────
function FilterSidebar({ filters, onChange, onClear, total }) {
  const sizes   = ['XS','S','M','L','XL','XXL'];
  const colors  = ['Black','White','Brown','Green','Blue','Grey','Cream','Yellow'];
  const patterns = ['Plain','Checks','Stripes','Prints','Floral'];
  const fits    = ['Relaxed','Slim','Regular','Oversized'];
  const materials = ['Cotton','Linen','Denim','Corduroy','Jersey'];

  const toggle = (key, val) => {
    const current = filters[key] || [];
    const next = current.includes(val)
      ? current.filter(v => v !== val)
      : [...current, val];
    onChange({ ...filters, [key]: next });
  };

  const CheckPill = ({ group, val }) => {
    const active = (filters[group] || []).includes(val);
    return (
      <button
        onClick={() => toggle(group, val)}
        className={`filter-pill ${active ? 'active' : ''} mr-1 mb-1`}
      >
        {val}
      </button>
    );
  };

  return (
    <aside className="w-48 shrink-0 pr-6 hidden md:block">
      <p className="label-sm mb-4">FILTERS</p>

      <FilterSection label="DELIVERY TIME">
        <div className="space-y-2 text-xs text-garm-gray">
          <label className="flex items-center gap-2 cursor-pointer hover:text-garm-black">
            <input type="radio" name="delivery" className="accent-garm-black" /> 1–2 Days
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-garm-black">
            <input type="radio" name="delivery" className="accent-garm-black" /> 3–5 Days
          </label>
        </div>
      </FilterSection>

      <FilterSection label="SIZE">
        <div className="flex flex-wrap">
          {sizes.map(s => <CheckPill key={s} group="sizes" val={s} />)}
        </div>
      </FilterSection>

      <FilterSection label="COLOR">
        <div className="flex flex-wrap">
          {colors.map(c => <CheckPill key={c} group="colors" val={c} />)}
        </div>
      </FilterSection>

      <FilterSection label="PATTERN">
        <div className="flex flex-wrap">
          {patterns.map(p => <CheckPill key={p} group="patterns" val={p} />)}
        </div>
      </FilterSection>

      <FilterSection label="FIT">
        <div className="flex flex-wrap">
          {fits.map(f => <CheckPill key={f} group="fits" val={f} />)}
        </div>
      </FilterSection>

      <FilterSection label="MATERIAL">
        <div className="flex flex-wrap">
          {materials.map(m => <CheckPill key={m} group="materials" val={m} />)}
        </div>
      </FilterSection>

      <FilterSection label="PRICE">
        <div className="space-y-2 pt-1">
          <input
            type="range" min={0} max={500} step={10}
            value={filters.maxPrice || 500}
            onChange={e => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full accent-garm-black"
          />
          <p className="text-xs text-garm-gray">Up to {filters.maxPrice || 500} AUD</p>
        </div>
      </FilterSection>

      {/* Clear & Apply */}
      <div className="flex gap-2 mt-6">
        <button onClick={onClear} className="btn-outline text-[10px] px-4 py-2 flex-1">
          CLEAR
        </button>
        <button className="btn-primary text-[10px] px-4 py-2 flex-1">
          APPLY ({total})
        </button>
      </div>
    </aside>
  );
}

// ─── Sort dropdown ────────────────────────────────────────────────
function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border border-garm-light-gray bg-transparent text-xs tracking-widest px-3 py-2 outline-none cursor-pointer"
    >
      <option value="menu_order">SORT</option>
      <option value="date">NEWEST</option>
      <option value="price">PRICE: LOW–HIGH</option>
      <option value="price-desc">PRICE: HIGH–LOW</option>
      <option value="popularity">POPULAR</option>
    </select>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function ShopPage({ isCollections = false }) {
  const [searchParams] = useSearchParams();

  // Map sort value to WC params
  const [sortVal,  setSortVal]  = useState('menu_order');
  const [filters,  setFilters]  = useState({});
  const [quickTag, setQuickTag] = useState('');
  const [page,     setPage]     = useState(1);

  // Reset page when filter/sort changes
  useEffect(() => { setPage(1); }, [sortVal, quickTag, filters]);

  const sortMap = {
    'menu_order': { orderby: 'menu_order', order: 'asc' },
    'date':       { orderby: 'date',       order: 'desc' },
    'price':      { orderby: 'price',      order: 'asc' },
    'price-desc': { orderby: 'price',      order: 'desc' },
    'popularity': { orderby: 'popularity', order: 'desc' },
  };

  const { products: raw, loading, total } = useProducts({
    per_page: 20,
    page,
    tag: quickTag,
    category: searchParams.get('category') || '',
    ...sortMap[sortVal],
  });

  // Normalise raw WC data
  const products = raw.map(normaliseProduct);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="px-4 md:px-8 py-8">
      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <p className="label-sm text-garm-gray mb-6">
        <Link to="/" className="hover:text-garm-black">HOME</Link>
        <span className="mx-2">/</span>
        <span className="text-garm-black">ALL</span>
      </p>

      {/* ── Page heading ─────────────────────────────────────────── */}
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-8">
        {isCollections ? 'COLLECTIONS' : 'SHOP ALL'}
      </h1>

      {/* ── Quick-filter pills ───────────────────────────────────── */}
      <div className="overflow-x-auto pb-3 mb-8">
        <div className="flex gap-2 w-max">
          {QUICK_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setQuickTag(value)}
              className={`filter-pill ${quickTag === value ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content row: sidebar + grid ─────────────────────── */}
      <div className="flex gap-8">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters({})}
          total={total}
        />

        {/* Product grid */}
        <div className="flex-1">

          {/* Sort + count row */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-garm-gray">{total} PRODUCTS</p>
            <SortDropdown value={sortVal} onChange={setSortVal} />
          </div>

          {loading ? (
            <SkeletonGrid count={20} />
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-garm-gray">
              <p className="label-sm">NO PRODUCTS FOUND</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((p, i) => (
                <div key={p.id} className="fade-up" style={{ animationDelay: `${(i % 8) * 0.05}s` }}>
                  <ProductCard product={p} priority={i < 4} />
                </div>
              ))}
            </div>
          )}

          {/* ── Pagination ──────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(v => v - 1)}
                className="btn-outline px-4 py-2 text-[10px] disabled:opacity-30"
              >
                ← PREV
              </button>
              <span className="label-sm px-4">{page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(v => v + 1)}
                className="btn-outline px-4 py-2 text-[10px] disabled:opacity-30"
              >
                NEXT →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
