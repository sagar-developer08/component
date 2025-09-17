// Centralized API endpoints
// Configure base URLs via environment variables if available

export const BASES = {
  catalog: process.env.NEXT_PUBLIC_CATALOG_BASE_URL || 'https://backendcatalog.qliq.ae/api',
  auth: process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'https://backendauth.qliq.ae/api',
  cart: process.env.NEXT_PUBLIC_CART_BASE_URL || 'https://backendcart.qliq.ae/api',
}

// Catalog endpoints
export const catalog = {
  base: BASES.catalog,
  brands: `${BASES.catalog}/brands`,
  products: `${BASES.catalog}/products`,
  stores: `${BASES.catalog}/stores`,
}

// Auth endpoints (auth base is explicitly namespaced with /auth as requested)
export const auth = {
  base: `${BASES.auth}/auth`,
  login: `${BASES.auth}/auth/login`,
  register: `${BASES.auth}/auth/register`,
  me: `${BASES.auth}/auth/me`,
}

export const cart = {
  base: BASES.cart,
  wishlistAdd: `${BASES.cart}/wishlist/add`,
  wishlistGet: `${BASES.cart}/wishlist`,
}

export default { catalog, auth, cart }


