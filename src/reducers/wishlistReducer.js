export const WISHLIST_ACTIONS = {
  TOGGLE: 'wishlist/toggle',
  REMOVE: 'wishlist/remove',
  CLEAR: 'wishlist/clear',
};

export const initialWishlistState = { items: [] };

export function wishlistReducer(state, action) {
  switch (action.type) {
    case WISHLIST_ACTIONS.TOGGLE: {
      const product = action.payload;
      const exists = state.items.some((i) => i.id === product.id);
      return {
        ...state,
        items: exists ? state.items.filter((i) => i.id !== product.id) : [product, ...state.items],
      };
    }
    case WISHLIST_ACTIONS.REMOVE:
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case WISHLIST_ACTIONS.CLEAR:
      return initialWishlistState;
    default:
      return state;
  }
}
