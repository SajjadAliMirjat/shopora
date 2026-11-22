export const CART_ACTIONS = {
  ADD: 'cart/add',
  REMOVE: 'cart/remove',
  INCREASE: 'cart/increase',
  DECREASE: 'cart/decrease',
  CLEAR: 'cart/clear',
};

export const initialCartState = { items: [] };

const clamp = (qty, stock) => Math.max(1, Math.min(qty, stock > 0 ? stock : 1));

export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: clamp(i.quantity + quantity, i.stock) } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...product, quantity: clamp(quantity, product.stock) }] };
    }
    case CART_ACTIONS.REMOVE:
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case CART_ACTIONS.INCREASE:
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: clamp(i.quantity + 1, i.stock) } : i
        ),
      };
    case CART_ACTIONS.DECREASE:
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
        ),
      };
    case CART_ACTIONS.CLEAR:
      return initialCartState;
    default:
      return state;
  }
}
