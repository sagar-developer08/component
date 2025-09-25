import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { catalog } from '../api/endpoints'

// Async thunk for fetching brands
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(catalog.brands)
      
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

const brandsSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    pagination: {},
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearBrands: (state) => {
      state.brands = []
      state.pagination = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Handle the API response structure: { success, message, data: { brands: [...], pagination: {...} } }
        const responseData = action.payload?.data || action.payload
        if (responseData && responseData.brands) {
          state.brands = responseData.brands || []
          state.pagination = responseData.pagination || {}
        }
        state.error = null
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  }
})

export const { clearError, clearBrands } = brandsSlice.actions
export default brandsSlice.reducer
