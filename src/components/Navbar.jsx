/**
 * Navbar.jsx
 * Sticky top navigation: Logo, nav links, search icon, cart icon.
 * Transparent on homepage hero, solid on scroll / other pages.
 */

import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// ─── Search icon ────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

// ─── Cart / bag icon ─────────────────────────────────────────────
function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

// ─── Hamburger (mobile) ──────────────────────────────────────────
function HamburgerIcon({ open }) {
  return (
    <div className="flex flex-col gap-1.5 cursor-pointer">
      <span className={`block h-px w-6 bg-current transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
      <span className={`block h-px w-6 bg-current transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
      <span className={`block h-px w-6 bg-current transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
    </div>
  );
}

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState('');
  const [time,       setTime]       = useState('');
  const { pathname } = useLocation();

  // India Standard Time (IST) Clock
  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat('en-IN', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect scroll so we can apply solid background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isHome    = pathname === '/';
  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      {/* ── Main bar ─────────────────────────────────────────────── */}
      <nav className={`
        sticky top-0 z-50 transition-all duration-300 px-4 md:px-8
        ${transparent
          ? 'bg-transparent text-garm-white'
          : 'bg-garm-white text-garm-black border-b border-garm-light-gray'}
      `}>
        {/* Top Row: Logo & Time (IST) */}
        <div className="flex items-center justify-between h-14 border-b border-garm-light-gray/20">
          <Link to="/" className="group flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-black tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-garm-black via-blue-600 to-blue-400 group-hover:from-blue-600 group-hover:to-blue-200 transition-all duration-700 drop-shadow-sm group-hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
              GARM
            </span>
            <div className="h-4 w-px bg-garm-light-gray/40 hidden sm:block mx-1" />
            <span className="label-sm opacity-30 text-[9px] tracking-[0.3em] group-hover:opacity-60 transition-opacity uppercase">Est. 2024</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="label-sm opacity-40 text-[9px] tracking-widest hidden sm:block uppercase">Current Local</span>
            <div className="label-sm opacity-80 font-mono text-[11px] tracking-widest bg-garm-cream/30 px-3 py-1 rounded-full border border-garm-light-gray/20">
              {time} <span className="opacity-40 ml-1">IST</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Nav Links & Icons */}
        <div className="flex items-center justify-between h-14">
          {/* Left: Hamburger (mobile) */}
          <div className="md:hidden" onClick={() => setMenuOpen(v => !v)}>
            <HamburgerIcon open={menuOpen} />
          </div>

          {/* Center/Left: Shop + Collections (desktop) */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `label-sm hover:opacity-60 transition-opacity ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              SHOP
            </NavLink>
            <NavLink
              to="/collections"
              className={({ isActive }) =>
                `label-sm hover:opacity-60 transition-opacity ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              COLLECTIONS
            </NavLink>
            <button className="label-sm hover:opacity-60 transition-opacity">MORE</button>
          </div>

          {/* Right: Search + Cart */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="label-sm hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              SEARCH
            </button>

            <button
              onClick={toggleCart}
              className="relative label-sm hover:opacity-60 transition-opacity flex items-center gap-2"
              aria-label="Open cart"
            >
              CART
              {itemCount > 0 && (
                <span className="text-[10px] font-bold opacity-40">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Search Modal Overlay ────────────────────────────────── */}
      <div className={`
        fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-6
        transition-all duration-300
        ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        />

        {/* Modal Card */}
        <div className={`
          relative w-full max-w-[580px] bg-white rounded-xl shadow-2xl overflow-hidden
          transition-all duration-500 transform
          ${searchOpen ? 'translate-y-0 scale-100' : '-translate-y-8 scale-95'}
        `}>
          {/* Input Area */}
          <div className="flex items-center px-6 py-5 border-b border-black/5">
            <div className="text-black/40 mr-4">
              <SearchIcon />
            </div>
            <input
              autoFocus={searchOpen}
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="flex-1 bg-transparent outline-none text-base font-medium placeholder:text-black/20"
            />
            <button 
              onClick={() => {
                setSearchOpen(false);
                setSearchVal('');
              }}
              className="ml-4 w-6 h-6 flex items-center justify-center bg-black rounded-full text-white hover:bg-garm-orange transition-colors"
            >
              <span className="text-[10px]">✕</span>
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {searchVal.length > 0 ? (
              <div className="py-2">
                {[
                  { title: 'WOMENS', sub: '/shop/womens' },
                  { title: 'ACCESSORIES', sub: '/shop/accessories' },
                  { title: 'MENS', sub: '/shop/mens' },
                  { title: 'CLASSICS', sub: '/collections/classics' },
                  { title: 'WINTER 2025', sub: '/collections/winter-2025' },
                  { title: 'ESSENTIALS', sub: '/collections/essentials' },
                ].map((res, i) => (
                  <Link
                    key={res.title}
                    to={res.sub}
                    className="flex flex-col px-8 py-4 hover:bg-black/[0.03] transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    <span className="text-[13px] font-bold tracking-wider mb-1">{res.title}</span>
                    <span className="text-[10px] text-black/30 tracking-widest">{res.sub}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="label-sm opacity-20 text-[10px]">Start typing to search...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile menu overlay ──────────────────────────────────── */}
      <div className={`
        fixed inset-0 z-40 bg-garm-white flex flex-col pt-20 px-8 gap-8
        transition-all duration-300 md:hidden
        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        {[
          { label: 'SHOP',        to: '/shop' },
          { label: 'COLLECTIONS', to: '/collections' },
          { label: 'MORE',        to: '/' },
        ].map(({ label, to }) => (
          <NavLink key={label} to={to} className="text-3xl font-bold tracking-tight hover:text-garm-orange transition-colors">
            {label}
          </NavLink>
        ))}
        <div className="divider" />
        <div className="flex flex-col gap-3 text-garm-gray label-sm">
          <Link to="/">FAQ</Link>
          <Link to="/">CONTACT</Link>
          <Link to="/">REFUNDS</Link>
        </div>
      </div>
    </>
  );
}
