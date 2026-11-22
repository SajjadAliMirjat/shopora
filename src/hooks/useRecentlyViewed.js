import { useCallback, useState } from 'react';
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage';
import { toSnapshot } from '../utils/products';

const LIMIT = 8;

export default function useRecentlyViewed() {
  const [items, setItems] = useState(() => {
    const saved = readStorage(STORAGE_KEYS.recent, []);
    return Array.isArray(saved) ? saved : [];
  });

  const add = useCallback((product) => {
    setItems((current) => {
      const next = [toSnapshot(product), ...current.filter((p) => p.id !== product.id)].slice(0, LIMIT);
      writeStorage(STORAGE_KEYS.recent, next);
      return next;
    });
  }, []);

  return { items, add };
}
