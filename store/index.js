import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import brandsReducer from './slices/brandsSlice'
import storesReducer from './slices/storesSlice'
import categoriesReducer from './slices/categoriesSlice'
import authReducer from './slices/authSlice'
import wishlistReducer from './slices/wishlistSlice'
import cartReducer from './slices/cartSlice'
import profileReducer from './slices/profileSlice'
import checkoutReducer from './slices/checkoutSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    brands: brandsReducer,
    stores: storesReducer,
    categories: categoriesReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    profile: profileReducer,
    checkout: checkoutReducer,
  },
})

export default store
