/**
 * useWooCommerce.js
 * Custom hooks for fetching data from the WooCommerce REST API.
 *
 * ─── Setup ────────────────────────────────────────────────────────
 * In your .env file (project root), add:
 *   REACT_APP_WC_URL=https://your-hostinger-domain.com
 *   REACT_APP_WC_KEY=ck_xxxxxxxxxxxxxxxxxxxxx
 *   REACT_APP_WC_SECRET=cs_xxxxxxxxxxxxxxxxxxxxx
 *
 * Generate keys in WordPress Admin → WooCommerce → Settings → Advanced → REST API
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react';

// ─── Base URL builder ──────────────────────────────────────────────
const BASE_URL   = process.env.REACT_APP_WC_URL    || '';
const WC_KEY     = process.env.REACT_APP_WC_KEY    || '';
const WC_SECRET  = process.env.REACT_APP_WC_SECRET || '';

/**
 * Builds a WooCommerce API URL with consumer key/secret auth params.
 * @param {string} endpoint  - e.g. '/wp-json/wc/v3/products'
 * @param {object} params    - additional query params
 */
function wcUrl(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('consumer_key',    WC_KEY);
  url.searchParams.set('consumer_secret', WC_SECRET);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

// ─── Generic fetch helper ─────────────────────────────────────────
async function wcFetch(endpoint, params = {}) {
  const res = await fetch(wcUrl(endpoint, params));
  if (!res.ok) throw new Error(`WooCommerce API error: ${res.status}`);
  return res.json();
}

// ─── Hook: all products (with optional filters) ───────────────────
/**
 * @param {object} filters - { category, tag, per_page, page, orderby, order }
 */
export function useProducts(filters = {}) {
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState(null);
  const [total,    setTotal]      = useState(0);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // WC v3 endpoint for listing products
      const res = await fetch(wcUrl('/wp-json/wc/v3/products', {
        per_page: filters.per_page || 24,
        page:     filters.page     || 1,
        category: filters.category || '',
        tag:      filters.tag      || '',
        orderby:  filters.orderby  || 'menu_order',
        order:    filters.order    || 'asc',
        status:   'publish',
      }));
      if (!res.ok) throw new Error(`${res.status}`);
      const data       = await res.json();
      const totalCount = res.headers.get('X-WP-Total');
      setProducts(data);
      setTotal(Number(totalCount) || data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    filters.per_page,
    filters.page,
    filters.category,
    filters.tag,
    filters.orderby,
    filters.order,
  ]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { products, loading, error, total, refetch: fetch_ };
}

// ─── Hook: single product by ID or slug ──────────────────────────
/**
 * @param {string|number} idOrSlug
 */
export function useProduct(idOrSlug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!idOrSlug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Try by ID first; if NaN, search by slug
        const isId = !isNaN(Number(idOrSlug));
        let data;

        if (isId) {
          data = await wcFetch(`/wp-json/wc/v3/products/${idOrSlug}`);
        } else {
          // Search by slug: WC returns an array
          const arr = await wcFetch('/wp-json/wc/v3/products', { slug: idOrSlug });
          data = arr[0] || null;
        }

        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [idOrSlug]);

  return { product, loading, error };
}

// ─── Hook: product categories (collections) ──────────────────────
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await wcFetch('/wp-json/wc/v3/products/categories', {
          per_page: 100,
          hide_empty: true,
          orderby: 'menu_order',
          order: 'asc',
        });
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { categories, loading, error };
}

// ─── Hook: create WooCommerce order (checkout) ───────────────────
/**
 * @param {object} orderData - WC order payload
 * @returns {{ createOrder, loading, error, order }}
 */
export function useCreateOrder() {
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await wcFetch('/wp-json/wc/v3/orders', {});
      // POST requires body; wcFetch is GET-only, so we use fetch directly here
      const res = await fetch(wcUrl('/wp-json/wc/v3/orders'), {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const created = await res.json();
      setOrder(created);
      return created;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createOrder, loading, error, order };
}

// ─── Utility: transform WC product to our shape ──────────────────
/**
 * Normalises a raw WooCommerce product object into a consistent shape
 * used throughout the app.
 */
export function normaliseProduct(p) {
  if (!p) return null;
  return {
    id:          p.id,
    slug:        p.slug,
    name:        p.name,
    price:       parseFloat(p.price || 0),
    salePrice:   p.sale_price ? parseFloat(p.sale_price) : null,
    regularPrice:parseFloat(p.regular_price || 0),
    currency:    'AUD',                     // change to match your store
    image:       p.images?.[0]?.src || '',
    images:      p.images?.map(i => i.src) || [],
    categories:  p.categories?.map(c => c.name) || [],
    tags:        p.tags?.map(t => t.name) || [],
    description: p.description || '',
    shortDesc:   p.short_description || '',
    attributes:  p.attributes || [],        // includes Size, Color etc.
    variations:  p.variations || [],        // variation IDs
    inStock:     p.stock_status === 'instock',
    sku:         p.sku,
  };
}
