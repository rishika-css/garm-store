/**
 * Layout.jsx
 * Wraps every page with: AnnouncementBar → Navbar → <Outlet> → Footer
 * CartDrawer is portal-rendered inside here (always mounted).
 */

import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar          from './Navbar';
import Footer          from './Footer';
import CartDrawer      from './CartDrawer';
import ScrollProgressBar from './ScrollProgressBar';
import FreshlyBaked    from './FreshlyBaked';
import useScrollToTop  from '../hooks/useScrollToTop';

export default function Layout() {
  // Scroll to top on every route change
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col bg-garm-white">
      {/* Announcement ticker */}
      <AnnouncementBar />

      {/* Sticky navigation */}
      <Navbar />

      {/* Scroll indicator (absolute positioned) */}
      <ScrollProgressBar />

      {/* Cart drawer (always in DOM, hidden via transform) */}
      <CartDrawer />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Dynamic branding banner */}
      <FreshlyBaked />

      {/* Footer */}
      <Footer />
    </div>
  );
}
