# Shopora

A modern e-commerce storefront by **SajooDev**. Built with React, Vite, Tailwind CSS and React Router.
Products come from the [DummyJSON](https://dummyjson.com/products) API, with a bundled 20-product fallback catalogue so the app keeps working offline.

## Install and run

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build and preview

```bash
npm run build      # outputs to dist/
npm run preview    # serves the production build locally
```

## Deploy to Vercel

**Option A: Vercel dashboard**
1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New → Project** and import the repository.
3. Vercel detects Vite automatically. Confirm: Build Command `npm run build`, Output Directory `dist`.
4. Click **Deploy**. The included `vercel.json` rewrites all routes to `index.html`, so deep links such as `/product/5` work on refresh.

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

## Features

- Home, Shop, Product details, Category, Cart, Wishlist, About and 404 pages
- Search (title, description, brand, tags), category, price range and rating filters that all combine
- Sort by featured, price low to high, price high to low, and top rated
- Active filter chips, results count, empty state and a mobile filter drawer
- Load More pagination, loading skeletons, error handling with retry
- Cart with quantity controls, stock limits, shipping fee (free over $100) and totals
- Wishlist with move-to-cart
- Cart, wishlist and recently viewed saved in LocalStorage
- Quick-view modal, toast notifications, breadcrumbs, back-to-top button
- Accessible dialogs (focus trap, Escape to close), skip link, visible focus, reduced-motion support

## Project structure

```
src/
  assets/       placeholder image
  components/   reusable UI (ProductCard, FilterPanel, Navbar, QuickViewModal, ...)
  context/      Cart, Wishlist, Products and Toast providers
  data/         fallbackProducts.json (20 products)
  hooks/        useDebounce, useDialog, useRecentlyViewed, usePageTitle
  pages/        route-level screens
  reducers/     cartReducer, wishlistReducer
  services/     api.js (DummyJSON requests, timeout, normalisation, fallback)
  utils/        formatting, filtering/sorting, LocalStorage helpers
```

## How the data flows

- `ProductsContext` fetches `/products?limit=0` once. If the request fails, it switches to the bundled catalogue and shows a banner with a **Retry** button.
- The product details page fetches `/products/:id` on its own and falls back to the bundled product if needed.
- Cart and wishlist use `useReducer` inside Context providers. Search, filters, sorting and UI state are local to the components that use them.
