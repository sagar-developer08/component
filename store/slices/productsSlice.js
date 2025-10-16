import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { catalog, search } from '../api/endpoints'

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const { lastFetchTime, cacheExpiry } = state.products
      
      // Check if data is still fresh (within cache expiry time)
      if (lastFetchTime && Date.now() - lastFetchTime < cacheExpiry) {
        console.log('Using cached products data')
        return { fromCache: true }
      }
      
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

// Async thunk for searching products with filters
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, filters = {}, sort = 'relevance' }, { rejectWithValue }) => {
    try {
      console.log('Searching for:', query, 'with filters:', filters)
      
      // Build query params from filters
      const params = new URLSearchParams({ q: query, sort })
      
      // Price filter
      if (filters.price?.min !== undefined && filters.price?.min !== '') {
        params.append('min_price', filters.price.min)
      }
      if (filters.price?.max !== undefined && filters.price?.max !== '') {
        params.append('max_price', filters.price.max)
      }
      
      // Availability filter
      if (filters.availability instanceof Set) {
        if (filters.availability.has('in') && !filters.availability.has('out')) {
          params.append('in_stock', 'true')
        } else if (filters.availability.has('out') && !filters.availability.has('in')) {
          params.append('in_stock', 'false')
        }
      }
      
      // Rating filter
      if (typeof filters.rating === 'number') {
        params.append('min_rating', filters.rating)
      }
      
      // Offer filter
      if (filters.offer instanceof Set && filters.offer.has('on_offer')) {
        params.append('is_offer', 'true')
      }
      
      // Brand filter (multiple)
      if (filters.brand instanceof Set && filters.brand.size > 0) {
        Array.from(filters.brand).forEach(b => params.append('brand_id', b))
      }
      
      // Store filter (multiple)
      if (filters.store instanceof Set && filters.store.size > 0) {
        Array.from(filters.store).forEach(s => params.append('store_id', s))
      }
      
      // Category filters
      const categoryMapping = {
        'department': 'level2',
        'subcategory': 'level3',
        'category': 'level4'
      }
      for (const [key, apiParam] of Object.entries(categoryMapping)) {
        if (filters[key] instanceof Set && filters[key].size > 0) {
          // For simplicity, we'll use the first selected category (extend if needed)
          const firstCat = Array.from(filters[key])[0]
          params.append(apiParam, firstCat)
        }
      }
      
      // Tags filter
      if (filters.tags instanceof Set && filters.tags.size > 0) {
        Array.from(filters.tags).forEach(t => params.append('tags', t))
      }
      
      // Dynamic attribute filters (attr.*)
      Object.keys(filters).forEach(key => {
        if (key.startsWith('attr.')) {
          const attrKey = key.substring(5)
          const values = filters[key] instanceof Set ? Array.from(filters[key]) : []
          values.forEach(v => params.append(`attr_${attrKey}`, v))
        }
      })
      
      // Dynamic specification filters (spec.*)
      Object.keys(filters).forEach(key => {
        if (key.startsWith('spec.')) {
          const specKey = key.substring(5)
          const values = filters[key] instanceof Set ? Array.from(filters[key]) : []
          values.forEach(v => params.append(`spec_${specKey}`, v))
        }
      })
      
      const url = `${search.base}/search/products?${params.toString()}`
      console.log('Search URL:', url)
      
      const response = await fetch(url)
      
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

// Async thunk for fetching search suggestions
export const fetchSearchSuggestions = createAsyncThunk(
  'products/fetchSearchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      if (!query || query.trim().length < 2) {
        return { suggestions: [] }
      }
      
      console.log('Fetching suggestions for:', query)
      // Use the same endpoint as search results but with limit for suggestions
      const response = await fetch(search.products(query, { limit: 5 }))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Suggestions response:', data)
      return data
    } catch (error) {
      console.error('Suggestions error:', error)
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
    searchSuggestions: [],
    suggestionsLoading: false,
    suggestionsError: null,
    pagination: {},
    loading: false,
    searchLoading: false,
    error: null,
    searchError: null,
    success: false,
    // Cache timestamps for performance
    lastFetchTime: null,
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
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
    },
    clearSuggestions: (state) => {
      state.searchSuggestions = []
      state.suggestionsError = null
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
        
        // Only update data if not from cache
        if (!action.payload.fromCache && action.payload.success && action.payload.data) {
          state.products = action.payload.data.products || []
          state.bestsellers = action.payload.data.bestseller || []
          state.offers = action.payload.data.offers || []
          state.qliqPlusDeals = action.payload.data.qliqPlusDeals || []
          state.featured = action.payload.data.featured || []
          state.pagination = action.payload.data.pagination || {}
          state.lastFetchTime = Date.now()
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
      // Search suggestions cases
      .addCase(fetchSearchSuggestions.pending, (state) => {
        state.suggestionsLoading = true
        state.suggestionsError = null
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false
        if (action.payload.success && action.payload.data) {
          // Use the same data structure as search results since we're using the same endpoint
          state.searchSuggestions = action.payload.data.products || []
        } else {
          state.searchSuggestions = []
        }
        state.suggestionsError = null
      })
      .addCase(fetchSearchSuggestions.rejected, (state, action) => {
        state.suggestionsLoading = false
        state.suggestionsError = action.payload
        state.searchSuggestions = []
      })
  }
})

export const { clearError, clearProducts, clearSuggestions } = productsSlice.actions
export default productsSlice.reducer
