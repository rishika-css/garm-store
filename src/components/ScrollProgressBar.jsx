import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ScrollProgressBar.jsx
 * A static bottom bar matching the "Freshly Baked" reference design:
 *  - Wide pill at the bottom of the viewport
 *  - Left side: neon-yellow fill that grows with scroll progress,
 *    with "F®ESHLY BAKED" branding in bold black
 *  - Right side: "Menu" button on a white background
 */
export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const totalScrollable = documentHeight - windowHeight;
      const progress = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0;

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-bar-wrapper">
      <div className="scroll-bar-container">
        {/* Progress fill (neon yellow) */}
        <div
          className="scroll-bar-fill"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Left: Branding text */}
        <div className="scroll-bar-brand">
          <span className="scroll-bar-brand-text">
            F<span className="scroll-bar-symbol">®</span>ESHLY&nbsp;&nbsp;BAKED
          </span>
        </div>

        {/* Right: Explore button */}
        <button
          className="scroll-bar-menu"
          onClick={() => navigate('/faq')}
        >
          EXPLORE
        </button>
      </div>
    </div>
  );
}
