import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for fetching stores
export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://backendcatalog.qliq.ae/api/stores')
      
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
          
          // Filter top stores (you can customize this logic based on your criteria)
          // For now, I'll take the first 4 stores as "top stores"
          state.topStores = allStores.slice(0, 4)
          
          // Filter new stores (you can customize this logic based on your criteria)
          // For now, I'll take stores from index 4 onwards as "new stores"
          state.newStores = allStores.slice(4)
          
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
