import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { catalog } from '../api/endpoints'

// Async thunk for fetching homepage sections
export const fetchHomepageSections = createAsyncThunk(
  'homepageSections/fetchHomepageSections',
  async (params = { isActive: true }, { rejectWithValue }) => {
    try {
      const response = await fetch(catalog.homepageSections(params))
      
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

const homepageSectionsSlice = createSlice({
  name: 'homepageSections',
  initialState: {
    sections: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSections: (state) => {
      state.sections = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageSections.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchHomepageSections.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // Handle the API response structure: { success, message, data: { brand: [], categories: [], hypermarket: [], supermarket: [] } }
        const responseData = action.payload?.data || action.payload
        if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
          // New grouped structure
          state.sections = responseData
        } else if (Array.isArray(responseData)) {
          // Legacy array structure (fallback)
          state.sections = responseData
        }
        state.error = null
      })
      .addCase(fetchHomepageSections.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  }
})

export const { clearError, clearSections } = homepageSectionsSlice.actions
export default homepageSectionsSlice.reducer

