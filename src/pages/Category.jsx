import { Link, useParams } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductBrowser from '../components/ProductBrowser';
import OfflineNotice from '../components/OfflineNotice';
import EmptyState from '../components/EmptyState';
import usePageTitle from '../hooks/usePageTitle';
import { formatCategory } from '../utils/format';

export default function Category() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const name = formatCategory(slug);
  const exists = products.some((p) => p.category === slug);
  usePageTitle(name);

  if (!loading && !exists) {
    return (
      <div className="container-x py-16">
        <EmptyState icon={LayoutGrid} title="We could not find that category" message={`There are no products in "${name}". Try browsing the full catalogue.`}>
          <Link to="/shop" className="btn btn-primary">Browse all products</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: name }]} />
      <header className="mb-8">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">{name}</h1>
        <p className="mt-2 text-muted">Everything in {name.toLowerCase()}, with search, price and rating filters.</p>
      </header>
      <OfflineNotice />
      <ProductBrowser products={products} loading={loading} lockedCategory={slug} />
    </div>
  );
}
