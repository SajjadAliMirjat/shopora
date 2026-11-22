import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { CART_ACTIONS, cartReducer, initialCartState } from '../reducers/cartReducer';
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage';
import { getSalePrice, roundMoney } from '../utils/format';
import { toSnapshot } from '../utils/products';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_FEE = 7.99;

const init = () => {
  const saved = readStorage(STORAGE_KEYS.cart, null);
  return saved && Array.isArray(saved.items) ? saved : initialCartState;
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, init);
  const { notify } = useToast();

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, state);
  }, [state]);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (!product.stock || product.stock <= 0) {
        notify(`${product.title} is out of stock`, 'error');
        return false;
      }
      const existing = state.items.find((i) => i.id === product.id);
      if (existing && existing.quantity >= product.stock) {
        notify(`You already have the maximum available (${product.stock})`, 'info');
        return false;
      }
      dispatch({ type: CART_ACTIONS.ADD, payload: { product: toSnapshot(product), quantity } });
      notify(`Added ${product.title} to your cart`);
      return true;
    },
    [state.items, notify]
  );

  const removeFromCart = useCallback(
    (id) => {
      const item = state.items.find((i) => i.id === id);
      dispatch({ type: CART_ACTIONS.REMOVE, payload: id });
      if (item) notify(`Removed ${item.title} from your cart`, 'info');
    },
    [state.items, notify]
  );

  const increase = useCallback(
    (id) => {
      const item = state.items.find((i) => i.id === id);
      if (item && item.quantity >= item.stock) {
        notify(`Only ${item.stock} available`, 'info');
        return;
      }
      dispatch({ type: CART_ACTIONS.INCREASE, payload: id });
    },
    [state.items, notify]
  );

  const decrease = useCallback((id) => dispatch({ type: CART_ACTIONS.DECREASE, payload: id }), []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR });
    notify('Your cart is now empty', 'info');
  }, [notify]);

  const getQuantity = useCallback(
    (id) => state.items.find((i) => i.id === id)?.quantity ?? 0,
    [state.items]
  );

  const totals = useMemo(() => {
    const totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = roundMoney(state.items.reduce((sum, i) => sum + getSalePrice(i) * i.quantity, 0));
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return { totalQuantity, subtotal, shipping, total: roundMoney(subtotal + shipping) };
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      ...totals,
      addToCart,
      removeFromCart,
      increase,
      decrease,
      clearCart,
      getQuantity,
    }),
    [state.items, totals, addToCart, removeFromCart, increase, decrease, clearCart, getQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
