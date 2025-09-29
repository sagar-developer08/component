import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { catalog } from '../api/endpoints'

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(catalog.products)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for fetching store products
export const fetchStoreProducts = createAsyncThunk(
  'products/fetchStoreProducts',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${catalog.base}/products/store/${storeId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for searching products
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      console.log('Searching for:', query)
      const response = await fetch(catalog.searchProducts(query))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Search response:', data)
      return data
    } catch (error) {
      console.error('Search error:', error)
      return rejectWithValue(error.message)
    }
  }
)


const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    bestsellers: [],
    offers: [],
    qliqPlusDeals: [],
    featured: [],
    storeProducts: [],
    searchResults: [],
    searchQuery: '',
    searchPagination: {},
    pagination: {},
    loading: false,
    searchLoading: false,
    error: null,
    searchError: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearProducts: (state) => {
      state.products = []
      state.bestsellers = []
      state.offers = []
      state.qliqPlusDeals = []
      state.featured = []
      state.storeProducts = []
      state.pagination = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.success
        if (action.payload.success && action.payload.data) {
          state.products = action.payload.data.products || []
          state.bestsellers = action.payload.data.bestseller || []
          state.offers = action.payload.data.offers || []
          state.qliqPlusDeals = action.payload.data.qliqPlusDeals || []
          state.featured = action.payload.data.featured || []
          state.pagination = action.payload.data.pagination || {}
        }
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(fetchStoreProducts.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchStoreProducts.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.success
        if (action.payload.success && action.payload.data) {
          state.storeProducts = action.payload.data.products || action.payload.data || []
        }
        state.error = null
      })
      .addCase(fetchStoreProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Search products cases
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true
        state.searchError = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false
        state.success = action.payload.success
        if (action.payload.success && action.payload.data) {
          state.searchResults = action.payload.data.products || []
          state.searchQuery = action.payload.data.query || ''
          state.searchPagination = action.payload.data.pagination || {}
        }
        state.searchError = null
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false
        state.searchError = action.payload
        state.success = false
      })
  }
})

export const { clearError, clearProducts } = productsSlice.actions
export default productsSlice.reducer
