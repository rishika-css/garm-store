/**
 * App.jsx
 * Root component. Sets up:
 *  - CartProvider (global cart state)
 *  - BrowserRouter with all routes
 *  - Layout wraps every route via <Outlet>
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider }    from './context/CartContext';
import Layout              from './components/Layout';
import HomePage            from './pages/HomePage';
import ShopPage            from './pages/ShopPage';
import CollectionsPage     from './pages/CollectionsPage';
import ProductPage         from './pages/ProductPage';
import FAQPage             from './pages/FAQPage';
import NotFoundPage        from './pages/NotFoundPage';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter basename="/garm-store">
        <Routes>
          {/* All pages share the same Layout (AnnouncementBar + Navbar + Footer + CartDrawer) */}
          <Route element={<Layout />}>
            <Route index            path="/"              element={<HomePage />} />
            <Route                  path="/shop"          element={<ShopPage />} />
            {/* Collections page reuses ShopPage with isCollections flag */}
            <Route                  path="/collections"   element={<CollectionsPage />} />
            {/* Product detail — :slug matches both slugs and numeric IDs */}
            <Route                  path="/product/:slug" element={<ProductPage />} />
            <Route                  path="/faq"          element={<FAQPage />} />
            {/* Catch-all 404 */}
            <Route                  path="*"              element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
