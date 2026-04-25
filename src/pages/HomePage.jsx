/**
 * HomePage.jsx
 * Mirrors the home.pdf design:
 *  1. Full-width hero carousel (Perfumes / Denim / Linen banners)
 *  2. MENS / WOMENS split section
 *  3. "WE DO" scroll-driven services reveal
 *  4. Collections photoshoot strip with horizontal scroll
 */

import { Link } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useProducts } from '../hooks/useWooCommerce';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';

// ─── Hero Slide ───────────────────────────────────────────────────
function HeroSlide({ bg, title, subtitle, cta, href }) {
  return (
    <Link
      to={href}
      className="relative min-w-full h-[55vw] max-h-[600px] flex items-end overflow-hidden group"
      style={{ background: bg }}
    >
      <div className="relative z-10 p-8 md:p-14 pb-10">
        {subtitle && (
          <p className="label-sm text-white/70 mb-2">{subtitle}</p>
        )}
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none mb-4">
          {title}
        </h2>
        <span className="label-sm text-white border-b border-white pb-0.5 group-hover:text-garm-orange group-hover:border-garm-orange transition-colors">
          {cta} →
        </span>
      </div>
    </Link>
  );
}

// ─── Hero carousel (CSS-only snap scroll) ────────────────────────
function HeroCarousel() {
  const slides = [
    {
      bg:       'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      title:    'LIVE IN DENIM',
      subtitle: 'BAGGY · RELAXED · STRAIGHT',
      cta:      'SHOP DENIM',
      href:     '/shop?category=denim',
    },
    {
      bg:       'linear-gradient(135deg, #2d1b0e 0%, #3d2614 60%, #5c3a1e 100%)',
      title:    'LINEN COLLECTION',
      subtitle: 'BREEZY IN EVERY SEASON',
      cta:      'SHOP LINEN',
      href:     '/shop?category=linen',
    },
    {
      bg:       'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      title:    'WINTER\nCOLLECTION 3',
      subtitle: 'NEW ARRIVALS',
      cta:      'EXPLORE NOW',
      href:     '/collections',
    },
  ];

  return (
    <div className="relative w-full overflow-x-auto snap-x snap-mandatory flex scrollbar-none">
      {slides.map((s, i) => (
        <HeroSlide key={i} {...s} />
      ))}
    </div>
  );
}

// ─── Gender split ─────────────────────────────────────────────────
function GenderSplit() {
  return (
    <section className="grid grid-cols-2 h-[60vw] max-h-[700px]">
      {/* MENS */}
      <Link
        to="/shop?gender=mens"
        className="relative overflow-hidden group bg-garm-black flex items-end"
      >
        {/* Placeholder gradient — replace with actual model image */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"
          style={{ backgroundImage: 'url(/images/mens-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
        />
        <div className="relative z-10 p-6 md:p-10">
          <span className="text-white font-bold text-xl md:text-3xl tracking-widest group-hover:text-garm-orange transition-colors">
            MENS
          </span>
        </div>
      </Link>

      {/* WOMENS */}
      <Link
        to="/shop?gender=womens"
        className="relative overflow-hidden group bg-garm-cream flex items-end"
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"
          style={{ backgroundImage: 'url(/images/womens-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
        />
        <div className="relative z-10 p-6 md:p-10">
          <span className="text-white font-bold text-xl md:text-3xl tracking-widest group-hover:text-garm-orange transition-colors">
            WOMENS
          </span>
        </div>
      </Link>
    </section>
  );
}

// ─── "WE DO" scroll-driven 3D cylinder reveal ───────────────────
const SERVICES = [
  'ART DIRECTION',
  'DEVELOPMENT',
  'BRAND IDENTITY',
  'CONTENT STRATEGY',
  'CAMPAIGNS',
  'NAMING',
];

// Cylinder geometry constants
const ITEM_ARC = 30;       // Degrees between each item on the cylinder
const CYLINDER_RADIUS = 320; // px – how far the text sits from the rotation axis

function WeDoSection() {
  const sectionRef = useRef(null);
  const [scrollFraction, setScrollFraction] = useState(SERVICES.length - 1); // start at NAMING (bottom)
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const lastScrollTime = useRef(0);

  // Track scroll and compute a fractional active index (smooth between items)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      if (sectionTop > 0 || sectionTop < -(sectionHeight - viewportHeight)) return;

      const progress = Math.abs(sectionTop) / (sectionHeight - viewportHeight);
      // Reverse: scroll down moves from NAMING (last) → ART DIRECTION (first)
      const fraction = (1 - progress) * (SERVICES.length - 1);
      setScrollFraction(fraction);

      if (progress >= 0.95 && !hasReachedEnd) {
        setHasReachedEnd(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasReachedEnd]);

  // Auto-advance past the section
  useEffect(() => {
    if (!hasReachedEnd) return;

    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        const now = Date.now();
        if (now - lastScrollTime.current < 500) return;
        lastScrollTime.current = now;
        const next = sectionRef.current?.nextElementSibling;
        if (next) next.scrollIntoView({ behavior: 'smooth' });
      } else {
        setHasReachedEnd(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [hasReachedEnd]);

  // 3D cylinder style for each item
  const getItemStyle = (index) => {
    // Distance from the "front" of the cylinder (fractional, for smooth rotation)
    const offset = index - scrollFraction;
    const angle = offset * ITEM_ARC;

    // Items far from center fade out
    const absOffset = Math.abs(offset);
    const opacity = Math.max(0.06, 1 - absOffset * 0.35);
    const scale = Math.max(0.45, 1 - absOffset * 0.15);

    // Color: active → black, others → progressively lighter gray
    let color;
    if (absOffset < 0.5) {
      color = '#0A0A0A';
    } else if (absOffset < 1.2) {
      color = '#B0B0B0';
    } else if (absOffset < 2.2) {
      color = '#CBCBCB';
    } else {
      color = '#DEDEDE';
    }

    return {
      transform: `
        rotateX(${angle}deg)
        translateZ(${CYLINDER_RADIUS}px)
        scale(${scale})
      `,
      opacity,
      color,
      fontWeight: absOffset < 0.5 ? 900 : 800,
      transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  };

  return (
    <section
      ref={sectionRef}
      className="wedo-section"
      style={{ height: `${SERVICES.length * 100 + 100}vh` }}
    >
      <div className="wedo-sticky">
        {/* "WE DO" header — outside 3D context so it's always visible */}
        <p className="wedo-header">WE DO</p>

        {/* 3D cylinder container */}
        <div className="wedo-cylinder">
          <div className="wedo-cylinder-inner">
            {SERVICES.map((service, i) => (
              <div
                key={service}
                className="wedo-service-item"
                style={getItemStyle(i)}
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Featured products (latest arrivals) ────────────────────────
function FeaturedProducts() {
  // Fetch 8 latest products from WooCommerce
  const { products, loading } = useProducts({ per_page: 8, orderby: 'date', order: 'desc' });

  return (
    <section id="featured-products" className="px-4 md:px-8 pb-20">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">NEW ARRIVALS</h2>
        <Link to="/shop" className="label-sm text-garm-gray hover:text-garm-black transition-colors border-b border-garm-light-gray pb-0.5">
          VIEW ALL →
        </Link>
      </div>

      {loading ? (
        <SkeletonGrid count={8} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => (
            <div key={p.id} className={`fade-up fade-up-delay-${Math.min(i + 1, 4)}`}>
              <ProductCard product={p} priority={i < 4} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Collections strip ───────────────────────────────────────────
function CollectionsStrip() {
  const collections = [
    { label: 'COLLECTIONS PHOTOSHOOT', href: '/collections' },
    { label: 'WINTER COLLECTION 3',    href: '/collections' },
  ];

  return (
    <section className="px-4 md:px-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        {collections.map(({ label, href }) => (
          <Link
            key={label}
            to={href}
            className="label-sm hover:text-garm-orange transition-colors"
          >
            {label} →
          </Link>
        ))}
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
        {[1,2,3,4,5].map(i => (
          <Link
            key={i}
            to="/collections"
            className="shrink-0 w-52 md:w-72 aspect-[3/4] bg-garm-cream img-zoom block"
          >
            {/* Replace with actual collection images */}
            <img
              src={`/images/collection-${i}.jpg`}
              alt={`Collection ${i}`}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none'; }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}


// ─── Page export ─────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="fade-up">
      <HeroCarousel />

      <div className="px-4 md:px-8 pt-8 pb-2 text-center">
        <p className="label-sm text-garm-gray">WELCOME TO GARM.</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-1">EXPLORE THE CATALOG.</h1>
      </div>

      <GenderSplit />
      <WeDoSection />
      <FeaturedProducts />
      <CollectionsStrip />
    </div>
  );
}
