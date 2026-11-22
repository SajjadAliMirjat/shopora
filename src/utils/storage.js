export const STORAGE_KEYS = {
  cart: 'shopora:cart',
  wishlist: 'shopora:wishlist',
  recent: 'shopora:recent',
};

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage can be full or blocked (private mode). The app keeps working in memory. */
  }
}
