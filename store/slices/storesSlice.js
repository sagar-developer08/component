import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { catalog } from '../api/endpoints'

// Async thunk for fetching stores
export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(catalog.stores)
      
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

const storesSlice = createSlice({
  name: 'stores',
  initialState: {
    stores: [],
    topStores: [],
    newStores: [],
    pagination: {},
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearStores: (state) => {
      state.stores = []
      state.topStores = []
      state.newStores = []
      state.pagination = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        if (action.payload && action.payload.stores) {
          const allStores = action.payload.stores || []
          state.stores = allStores
          
          // Show all stores in both sections for now
          state.topStores = allStores
          state.newStores = allStores
          
          state.pagination = action.payload.pagination || {}
        }
        state.error = null
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  }
})

export const { clearError, clearStores } = storesSlice.actions
export default storesSlice.reducer
