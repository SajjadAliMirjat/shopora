import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { WISHLIST_ACTIONS, initialWishlistState, wishlistReducer } from '../reducers/wishlistReducer';
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage';
import { toSnapshot } from '../utils/products';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

const init = () => {
  const saved = readStorage(STORAGE_KEYS.wishlist, null);
  return saved && Array.isArray(saved.items) ? saved : initialWishlistState;
};

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialWishlistState, init);
  const { notify } = useToast();

  useEffect(() => {
    writeStorage(STORAGE_KEYS.wishlist, state);
  }, [state]);

  const isWishlisted = useCallback((id) => state.items.some((i) => i.id === id), [state.items]);

  const toggleWishlist = useCallback(
    (product) => {
      const saved = state.items.some((i) => i.id === product.id);
      dispatch({ type: WISHLIST_ACTIONS.TOGGLE, payload: toSnapshot(product) });
      notify(saved ? `Removed ${product.title} from your wishlist` : `Saved ${product.title} to your wishlist`, saved ? 'info' : 'success');
    },
    [state.items, notify]
  );

  const removeFromWishlist = useCallback((id) => dispatch({ type: WISHLIST_ACTIONS.REMOVE, payload: id }), []);

  const clearWishlist = useCallback(() => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR });
    notify('Your wishlist is now empty', 'info');
  }, [notify]);

  const value = useMemo(
    () => ({
      items: state.items,
      count: state.items.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [state.items, isWishlisted, toggleWishlist, removeFromWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
