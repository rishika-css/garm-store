/**
 * useScrollToTop.js
 * Scrolls the window back to the top whenever the route changes.
 * Used inside Layout.jsx.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
}
