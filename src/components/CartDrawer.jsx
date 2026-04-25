/**
 * CartDrawer.jsx
 * Right-side slide-in drawer showing cart items.
 * Connects to CartContext for state and actions.
 */

import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// ─── Small X icon ────────────────────────────────────────────────
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

// ─── Single cart row ──────────────────────────────────────────────
function CartItem({ item }) {
  const { removeItem, updateQty } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-garm-light-gray">
      {/* Thumbnail */}
      <div className="w-20 h-24 bg-garm-cream shrink-0 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium leading-snug">{item.name}</p>
          <p className="label-sm text-garm-gray mt-1">SIZE: {item.size}</p>
        </div>

        {/* Qty controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-garm-light-gray">
            <button
              onClick={() => item.qty > 1
                ? updateQty(item.id, item.size, item.qty - 1)
                : removeItem(item.id, item.size)
              }
              className="px-2 py-1 text-sm hover:bg-garm-cream transition-colors"
            >
              −
            </button>
            <span className="px-3 text-sm">{item.qty}</span>
            <button
              onClick={() => updateQty(item.id, item.size, item.qty + 1)}
              className="px-2 py-1 text-sm hover:bg-garm-cream transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-sm font-medium">
            {(item.price * item.qty).toFixed(2)} AUD
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id, item.size)}
        className="self-start text-garm-gray hover:text-garm-black transition-colors"
        aria-label="Remove item"
      >
        <XIcon />
      </button>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────
export default function CartDrawer() {
  const { isOpen, items, subtotal, itemCount, closeCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div className={`
        fixed top-0 right-0 z-50 h-full w-full max-w-sm
        bg-garm-white flex flex-col
        transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-garm-light-gray">
          <span className="label-sm">BAG ({itemCount})</span>
          <button onClick={closeCart} aria-label="Close cart">
            <XIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-garm-gray">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="label-sm">YOUR BAG IS EMPTY</p>
              <button onClick={closeCart} className="btn-outline text-xs mt-2">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            items.map(item => <CartItem key={`${item.id}-${item.size}`} item={item} />)
          )}
        </div>

        {/* Footer: subtotal + checkout */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-garm-light-gray space-y-4">
            <div className="flex justify-between items-center">
              <span className="label-sm">SUBTOTAL</span>
              <span className="font-medium">{subtotal.toFixed(2)} AUD</span>
            </div>
            <p className="text-xs text-garm-gray">Shipping & taxes calculated at checkout.</p>
            {/* 
              Replace href below with your WooCommerce checkout URL.
              e.g. https://yourdomain.com/checkout
            */}
            <a
              href="/checkout"
              className="btn-primary w-full block text-center"
              onClick={closeCart}
            >
              CHECKOUT
            </a>
            <button onClick={closeCart} className="w-full text-center label-sm text-garm-gray hover:text-garm-black transition-colors">
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </>
  );
}
