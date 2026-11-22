import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <p className="font-display text-8xl font-extrabold tracking-tight text-accent sm:text-9xl">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">This page does not exist</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The link may be broken or the page may have moved. Head back to the shop to keep browsing.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-primary">Go home</Link>
          <Link to="/shop" className="btn btn-outline">Browse products</Link>
        </div>
      </div>
    </div>
  );
}
