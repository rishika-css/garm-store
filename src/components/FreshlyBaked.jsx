import { useState, useEffect } from 'react';

const FONTS = [
  'Helvetica Neue, Helvetica, Arial, sans-serif',
  'Georgia, serif',
  'Courier New, monospace',
  'Impact, Charcoal, sans-serif',
  'Times New Roman, Times, serif',
  '"Comic Sans MS", cursive',
  '"Trebuchet MS", Helvetica, sans-serif',
  'Verdana, Geneva, sans-serif',
  '"Arial Black", Gadget, sans-serif',
  'Palatino, "Palatino Linotype", serif',
  '"Lucida Console", Monaco, monospace'
];

export default function FreshlyBaked() {
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    // Rapid transition: every 120ms (slightly slower for better legibility)
    const interval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % FONTS.length);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden py-6 bg-[var(--garm-white)] select-none">
      <div className="marquee-track" style={{ '--ticker-speed': '25s' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center px-10">
            <span 
              className="text-lg md:text-2xl font-medium tracking-[0.1em] whitespace-nowrap transition-[font-family] duration-100"
              style={{ fontFamily: FONTS[fontIndex] }}
            >
              F<span className="text-[var(--garm-orange)]">®</span>ESHLY BAKED
            </span>
            <span className="mx-10 text-xs text-black/10">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
