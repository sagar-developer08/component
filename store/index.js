import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import brandsReducer from './slices/brandsSlice'
import storesReducer from './slices/storesSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    brands: brandsReducer,
    stores: storesReducer,
  },
})

export default store
