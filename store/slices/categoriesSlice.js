import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { catalog } from '../api/endpoints'

// Async thunk for fetching ecommerce level 2 categories
export const fetchEcommerceCategories = createAsyncThunk(
  'categories/fetchEcommerceCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${catalog.base}/categories/ecommerce/level2`)
      
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

// Async thunk for fetching ecommerce level 3 categories
export const fetchEcommerceLevel3Categories = createAsyncThunk(
  'categories/fetchEcommerceLevel3Categories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${catalog.base}/categories/ecommerce/level3`)
      
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

// Async thunk for fetching popular categories (level 3)
export const fetchPopularCategories = createAsyncThunk(
  'categories/fetchPopularCategories',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching popular categories from:', catalog.popularCategories)
      const response = await fetch(catalog.popularCategories)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Popular categories API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching popular categories:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for fetching level 2 categories
export const fetchLevel2Categories = createAsyncThunk(
  'categories/fetchLevel2Categories',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching level 2 categories from:', catalog.level2Categories)
      const response = await fetch(catalog.level2Categories)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Level 2 categories API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching level 2 categories:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for fetching hypermarket level 2 categories
export const fetchHypermarketLevel2Categories = createAsyncThunk(
  'categories/fetchHypermarketLevel2Categories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(catalog.hypermarketLevel2Categories)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Hypermarket level 2 categories API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching hypermarket level 2 categories:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for fetching supermarket level 2 categories
export const fetchSupermarketLevel2Categories = createAsyncThunk(
  'categories/fetchSupermarketLevel2Categories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(catalog.supermarketLevel2Categories)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Supermarket level 2 categories API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching supermarket level 2 categories:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for fetching store level 2 categories
export const fetchStoreLevel2Categories = createAsyncThunk(
  'categories/fetchStoreLevel2Categories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(catalog.storeLevel2Categories)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Store level 2 categories API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching store level 2 categories:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for fetching category children
export const fetchCategoryChildren = createAsyncThunk(
  'categories/fetchCategoryChildren',
  async (slug, { rejectWithValue }) => {
    try {
      const url = catalog.categoryChildren(slug)
      console.log('Fetching category children from:', url)
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Category children API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching category children:', error)
      return rejectWithValue(error.message)
    }
  }
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    ecommerceCategories: [],
    ecommerceLevel3Categories: [],
    popularCategories: [],
    level2Categories: [],
    hypermarketLevel2Categories: [],
    supermarketLevel2Categories: [],
    storeLevel2Categories: [],
    categoryChildren: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCategories: (state) => {
      state.ecommerceCategories = []
      state.ecommerceLevel3Categories = []
      state.popularCategories = []
      state.level2Categories = []
      state.hypermarketLevel2Categories = []
      state.supermarketLevel2Categories = []
      state.storeLevel2Categories = []
      state.categoryChildren = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEcommerceCategories.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchEcommerceCategories.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Handle the API response structure: { success, message, data: [...] }
        const responseData = action.payload?.data || action.payload
        if (Array.isArray(responseData)) {
          state.ecommerceCategories = responseData
        }
        state.error = null
      })
      .addCase(fetchEcommerceCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Level 3 Categories
      .addCase(fetchEcommerceLevel3Categories.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchEcommerceLevel3Categories.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Handle the API response structure: { success, message, data: [...] }
        const responseData = action.payload?.data || action.payload
        if (Array.isArray(responseData)) {
          state.ecommerceLevel3Categories = responseData
        }
        state.error = null
      })
      .addCase(fetchEcommerceLevel3Categories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Popular Categories
      .addCase(fetchPopularCategories.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchPopularCategories.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Handle the API response structure: { success, message, data: [...] }
        const responseData = action.payload?.data || action.payload
        console.log('Popular categories reducer - payload:', action.payload)
        console.log('Popular categories reducer - responseData:', responseData)
        if (Array.isArray(responseData)) {
          state.popularCategories = responseData
          console.log('Popular categories set in state:', responseData)
        } else {
          console.log('Response data is not an array:', responseData)
        }
        state.error = null
      })
      .addCase(fetchPopularCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Level 2 Categories
      .addCase(fetchLevel2Categories.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchLevel2Categories.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Handle the API response structure: { success, message, data: [...] }
        const responseData = action.payload?.data || action.payload
        console.log('Level 2 categories reducer - payload:', action.payload)
        console.log('Level 2 categories reducer - responseData:', responseData)
        if (Array.isArray(responseData)) {
          state.level2Categories = responseData
          console.log('Level 2 categories set in state:', responseData)
        } else {
          console.log('Level 2 response data is not an array:', responseData)
        }
        state.error = null
      })
      .addCase(fetchLevel2Categories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Category Children
      .addCase(fetchCategoryChildren.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchCategoryChildren.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Store the entire response data
        state.categoryChildren = action.payload
        console.log('Category children set in state:', action.payload)
        state.error = null
      })
      .addCase(fetchCategoryChildren.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Hypermarket Level 2 Categories
      .addCase(fetchHypermarketLevel2Categories.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchHypermarketLevel2Categories.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Handle the API response structure: { success, message, data: [...] }
        const responseData = action.payload?.data || action.payload
        console.log('Hypermarket level 2 categories reducer - payload:', action.payload)
        console.log('Hypermarket level 2 categories reducer - responseData:', responseData)
        if (Array.isArray(responseData)) {
          state.hypermarketLevel2Categories = responseData
          console.log('Hypermarket level 2 categories set in state:', responseData)
        } else {
          console.log('Hypermarket level 2 response data is not an array:', responseData)
        }
        state.error = null
      })
      .addCase(fetchHypermarketLevel2Categories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Supermarket Level 2 Categories
      .addCase(fetchSupermarketLevel2Categories.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchSupermarketLevel2Categories.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Handle the API response structure: { success, message, data: [...] }
        const responseData = action.payload?.data || action.payload
        console.log('Supermarket level 2 categories reducer - payload:', action.payload)
        console.log('Supermarket level 2 categories reducer - responseData:', responseData)
        if (Array.isArray(responseData)) {
          state.supermarketLevel2Categories = responseData
          console.log('Supermarket level 2 categories set in state:', responseData)
        } else {
          console.log('Supermarket level 2 response data is not an array:', responseData)
        }
        state.error = null
      })
      .addCase(fetchSupermarketLevel2Categories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Store Level 2 Categories
      .addCase(fetchStoreLevel2Categories.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchStoreLevel2Categories.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Handle the API response structure: { success, message, data: [...] }
        const responseData = action.payload?.data || action.payload
        console.log('Store level 2 categories reducer - payload:', action.payload)
        console.log('Store level 2 categories reducer - responseData:', responseData)
        if (Array.isArray(responseData)) {
          state.storeLevel2Categories = responseData
          console.log('Store level 2 categories set in state:', responseData)
        } else {
          console.log('Store level 2 response data is not an array:', responseData)
        }
        state.error = null
      })
      .addCase(fetchStoreLevel2Categories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  }
})

export const { clearError, clearCategories } = categoriesSlice.actions
export default categoriesSlice.reducer
