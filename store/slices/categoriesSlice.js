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

// Async thunk for fetching all level 2 categories
export const fetchLevel2Categories = createAsyncThunk(
  'categories/fetchLevel2Categories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${catalog.base}/categories/level2`)
      
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

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    ecommerceCategories: [],
    ecommerceLevel3Categories: [],
    level2Categories: [],
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
      state.level2Categories = []
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
        if (Array.isArray(responseData)) {
          state.level2Categories = responseData
        }
        state.error = null
      })
      .addCase(fetchLevel2Categories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  }
})

export const { clearError, clearCategories } = categoriesSlice.actions
export default categoriesSlice.reducer
