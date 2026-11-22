import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAllProducts, getFallbackProducts } from '../services/api';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [state, setState] = useState({ products: [], loading: true, error: null, usingFallback: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchAllProducts(controller.signal)
      .then((products) => setState({ products, loading: false, error: null, usingFallback: false }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        // Keep the store usable: fall back to the bundled catalogue and surface the error.
        setState({
          products: getFallbackProducts(),
          loading: false,
          error: err.message || 'Could not load products.',
          usingFallback: true,
        });
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const value = useMemo(() => ({ ...state, retry }), [state, retry]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used inside ProductsProvider');
  return ctx;
}
