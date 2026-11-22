import { useProducts } from '../context/ProductsContext';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductBrowser from '../components/ProductBrowser';
import OfflineNotice from '../components/OfflineNotice';
import usePageTitle from '../hooks/usePageTitle';

export default function Shop() {
  usePageTitle('Shop');
  const { products, loading } = useProducts();

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />
      <header className="mb-8">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">Shop</h1>
        <p className="mt-2 max-w-xl text-muted">Search, filter and sort the full catalogue. Every filter works together.</p>
      </header>
      <OfflineNotice />
      <ProductBrowser products={products} loading={loading} />
    </div>
  );
}
