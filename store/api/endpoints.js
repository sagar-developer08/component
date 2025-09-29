// Centralized API endpoints
// Configure base URLs via environment variables if available

export const BASES = {
  catalog: process.env.NEXT_PUBLIC_CATALOG_BASE_URL || 'https://backendcatalog.qliq.ae/api',
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
  productsByBrand: (brandSlug) => `${BASES.catalog}/products/brand/${brandSlug}`,
  productsByStore: (storeId) => `${BASES.catalog}/products/store/${storeId}`,
  productsByLevel4Category: (categorySlug) => `${BASES.catalog}/products/level4/${categorySlug}`,
  stores: `${BASES.catalog}/stores`,
  storesDiscovery: `${BASES.catalog}/stores/discovery`,
  popularCategories: `${BASES.catalog}/categories/level3`,
  level2Categories: `${BASES.catalog}/categories/level2`,
  categoryChildren: (slug) => `${BASES.catalog}/categories/level2/${slug}/children`,
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
  wishlistAdd: `${BASES.cart}/wishlist/add`,
  wishlistGet: `${BASES.cart}/wishlist`,
  wishlistRemove: `${BASES.cart}/wishlist/remove`,
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

export default { catalog, auth, cart, addresses }


