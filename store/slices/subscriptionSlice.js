import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { decryptText } from '@/utils/crypto'
import { subscription } from '../api/endpoints'

// Async thunk for fetching subscription details
export const fetchSubscriptionDetails = createAsyncThunk(
  'subscription/fetchSubscriptionDetails',
  async (_, { rejectWithValue }) => {
    try {
      let token = ''
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';').map(c => c.trim())
        const tokenCookie = cookies.find(c => c.startsWith('accessToken='))
        if (tokenCookie) {
          try {
            const enc = decodeURIComponent(tokenCookie.split('=')[1] || '')
            token = await decryptText(enc)
          } catch (error) {
            console.error('Error decrypting token:', error)
          }
        }
      }

      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(subscription.details, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `HTTP error ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  subscriptionDetails: [],
  loading: false,
  error: null,
  success: false
}

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSubscriptionData: (state) => {
      state.subscriptionDetails = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionDetails.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchSubscriptionDetails.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.success
        
        if (action.payload.success && action.payload.data) {
          state.subscriptionDetails = action.payload.data
        }
        state.error = null
      })
      .addCase(fetchSubscriptionDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  }
})

export const { clearError, clearSubscriptionData } = subscriptionSlice.actions
export default subscriptionSlice.reducer
