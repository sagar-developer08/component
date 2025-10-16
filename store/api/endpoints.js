// Centralized API endpoints
// Configure base URLs via environment variables if available

export const BASES = {
  catalog: process.env.NEXT_PUBLIC_CATALOG_BASE_URL || 'https://backendcatalog.qliq.ae/api',
  search: process.env.NEXT_PUBLIC_SEARCH_BASE_URL || 'https://search.qliq.ae/api',
  auth: process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'https://backendauth.qliq.ae/api',
  cart: process.env.NEXT_PUBLIC_CART_BASE_URL || 'https://backendcart.qliq.ae/api',
  payment: process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || 'https://backendcart.qliq.ae/api',
}

// export const BASES = {
//   catalog: process.env.NEXT_PUBLIC_CATALOG_BASE_URL || (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'http://localhost:8003/api' : 'https://backendcatalog.qliq.ae/api'),
//   auth: process.env.NEXT_PUBLIC_AUTH_BASE_URL || (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'http://localhost:8888/api' : 'https://backendauth.qliq.ae/api'),
//   cart: process.env.NEXT_PUBLIC_CART_BASE_URL || (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'http://localhost:8002/api' : 'https://backendcart.qliq.ae/api'),
//   payment: process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'http://localhost:8002/api' : 'https://backendcart.qliq.ae/api'),
// }
// Catalog endpoints
export const catalog = {
  base: BASES.catalog,
  brands: `${BASES.catalog}/brands/top`,
  brandBySlug: (slug) => `${BASES.catalog}/brands/slug/${slug}`,
  products: `${BASES.catalog}/products`,
  productById: (id) => `${BASES.catalog}/products/${id}`,
  productBySlug: (id, slug) => `${BASES.catalog}/products/${id}/slug/${slug}`,
  productBySlugOnly: (slug) => `${BASES.catalog}/products/slug/${slug}`,
  productsByBrand: (brandSlug) => `${BASES.catalog}/products/brand/${brandSlug}`,
  productsByStore: (storeId) => `${BASES.catalog}/products/store/${storeId}`,
  productsByLevel4Category: (categorySlug) => `${BASES.catalog}/products/level4/${categorySlug}`,
  stores: `${BASES.catalog}/stores`,
  storesDiscovery: `${BASES.catalog}/stores/discovery`,
  popularCategories: `${BASES.catalog}/categories/level3`,
  level2Categories: `${BASES.catalog}/categories/level2`,
  categoryChildren: (slug) => `${BASES.catalog}/categories/level2/${slug}/children`,
  searchProducts: (query) => `${BASES.catalog}/search/products?q=${encodeURIComponent(query)}`,
}

// Search endpoints (new microservice)
export const search = {
  base: BASES.search,
  global: (query, type = 'all', page = 1, limit = 10) => `${BASES.search}/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`,
  products: (query, params = {}) => {
    const usp = new URLSearchParams({ q: query, ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)) });
    return `${BASES.search}/search/products?${usp.toString()}`;
  },
  suggestions: (query) => `${BASES.search}/search/suggestions?q=${encodeURIComponent(query)}`,
  byCategory: (categoryId, params = {}) => {
    const usp = new URLSearchParams({ categoryId, ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)) });
    return `${BASES.search}/search/category?${usp.toString()}`;
  },
  trending: (params = {}) => {
    const usp = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)));
    return `${BASES.search}/search/trending?${usp.toString()}`;
  },
  // Category filters endpoint
  categoryFilters: (slug, level) => `${BASES.search}/search/filters?slug=${encodeURIComponent(slug)}&level=${level}`,
  // Brand filters endpoint
  brandFilters: (slug) => `${BASES.search}/search/filters/brand?slug=${encodeURIComponent(slug)}`,
  // Store filters endpoint
  storeFilters: (storeId) => `${BASES.search}/search/filters/store?storeId=${encodeURIComponent(storeId)}`,
  // Store products endpoint
  storeProducts: (storeId, params = {}) => {
    const usp = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)));
    return `${BASES.search}/search/store/${encodeURIComponent(storeId)}/products?${usp.toString()}`;
  },
  // Search filters endpoint
  searchFilters: (query, params = {}) => {
    const usp = new URLSearchParams({ q: query, ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)) });
    return `${BASES.search}/search/filters/search?${usp.toString()}`;
  },
}

// Auth endpoints (auth base is explicitly namespaced with /auth as requested)
export const auth = {
  base: `${BASES.auth}/auth`,
  login: `${BASES.auth}/auth/login`,
  register: `${BASES.auth}/auth/signup`,
  me: `${BASES.auth}/auth/me`,
  profile: `${BASES.auth}/auth/profile`,
}

export const cart = {
  base: BASES.cart,
  add: `${BASES.cart}/cart/add`,
  get: `${BASES.cart}/cart`,
  update: `${BASES.cart}/cart/update`,
  remove: `${BASES.cart}/cart/remove`,
  moveToWishlist: `${BASES.cart}/cart/move-to-wishlist`,
  wishlistAdd: `${BASES.cart}/wishlist/add`,
  wishlistGet: `${BASES.cart}/wishlist`,
  wishlistRemove: `${BASES.cart}/wishlist/remove`,
  wishlistMoveToCart: `${BASES.cart}/wishlist/move-to-cart`,
}

export const payment = {
  base: BASES.payment,
  stripeCheckout: `${BASES.payment}/payment/stripe/checkout`,
  stripeHostedCheckout: `${BASES.payment}/payment/stripe/hosted-checkout`,
}

export const addresses = {
  base: `${BASES.auth}/addresses`,
  get: `${BASES.auth}/addresses`,
  create: `${BASES.auth}/addresses`,
  update: `${BASES.auth}/addresses`,
  delete: `${BASES.auth}/addresses`,
  setDefault: `${BASES.auth}/addresses/default`,
}

export default { catalog, search, auth, cart, addresses }


