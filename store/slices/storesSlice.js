import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { catalog } from '../api/endpoints'

// Async thunk for fetching stores discovery data
export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(catalog.storesDiscovery)
      
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
        // Handle the API response structure: { success, message, data: { newStores: [...], topStores: [...], totalNewStores, totalTopStores } }
        const responseData = action.payload?.data || action.payload
        if (responseData) {
          state.newStores = responseData.newStores || []
          state.topStores = responseData.topStores || []
          state.stores = [...(responseData.newStores || []), ...(responseData.topStores || [])]
          state.pagination = {
            totalNewStores: responseData.totalNewStores || 0,
            totalTopStores: responseData.totalTopStores || 0
          }
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
