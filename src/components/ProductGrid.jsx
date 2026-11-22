import { useCallback, useState } from 'react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';

export default function ProductGrid({ products, className = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }) {
  const [quickView, setQuickView] = useState(null);
  const close = useCallback(() => setQuickView(null), []);

  return (
    <>
      <div className={`grid gap-5 ${className}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
        ))}
      </div>
      {quickView && <QuickViewModal product={quickView} onClose={close} />}
    </>
  );
}
