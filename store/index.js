import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import brandsReducer from './slices/brandsSlice'
import storesReducer from './slices/storesSlice'
import authReducer from './slices/authSlice'
import wishlistReducer from './slices/wishlistSlice'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    brands: brandsReducer,
    stores: storesReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
  },
})

export default store
