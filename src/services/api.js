import fallback from '../data/fallbackProducts.json';

const BASE_URL = 'https://dummyjson.com';
const TIMEOUT_MS = 10000;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, externalSignal) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);
  const onAbort = () => controller.abort();
  externalSignal?.addEventListener('abort', onAbort);

  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
    if (!res.ok) throw new ApiError(`The server responded with status ${res.status}.`, res.status);
    return await res.json();
  } catch (err) {
    if (timedOut) throw new ApiError('The request timed out.', 408);
    if (err.name === 'AbortError') throw err; // cancelled by the caller
    if (err instanceof ApiError) throw err;
    throw new ApiError('Network error. Check your connection and try again.', 0);
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onAbort);
  }
}

export function normalizeProduct(raw) {
  const images = Array.isArray(raw.images) && raw.images.length ? raw.images : [raw.thumbnail].filter(Boolean);
  return {
    id: raw.id,
    title: raw.title ?? 'Untitled product',
    description: raw.description ?? '',
    category: raw.category ?? 'general',
    price: Number(raw.price) || 0,
    discountPercentage: Number(raw.discountPercentage) || 0,
    rating: Number(raw.rating) || 0,
    stock: Number.isFinite(raw.stock) ? raw.stock : 0,
    tags: raw.tags ?? [],
    brand: raw.brand ?? '',
    sku: raw.sku ?? '',
    warrantyInformation: raw.warrantyInformation ?? '',
    shippingInformation: raw.shippingInformation ?? '',
    returnPolicy: raw.returnPolicy ?? '',
    reviews: raw.reviews ?? [],
    thumbnail: raw.thumbnail || images[0] || '',
    images,
  };
}

export async function fetchAllProducts(signal) {
  const data = await request('/products?limit=0', signal);
  return data.products.map(normalizeProduct);
}

export async function fetchProductById(id, signal) {
  const data = await request(`/products/${encodeURIComponent(id)}`, signal);
  return normalizeProduct(data);
}

export const getFallbackProducts = () => fallback.products.map(normalizeProduct);

export const getFallbackProduct = (id) => {
  const found = fallback.products.find((p) => String(p.id) === String(id));
  return found ? normalizeProduct(found) : null;
};
