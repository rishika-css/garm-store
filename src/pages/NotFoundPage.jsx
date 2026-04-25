/**
 * NotFoundPage.jsx
 * 404 error page shown when a route doesn't match.
 */

import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-6">
      <p className="text-8xl font-bold tracking-tighter text-garm-light-gray">404</p>
      <h1 className="text-2xl font-bold tracking-tight">PAGE NOT FOUND</h1>
      <p className="text-garm-gray text-sm max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-4">
        BACK TO HOME
      </Link>
    </div>
  );
}
