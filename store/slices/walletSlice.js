import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { decryptText } from '@/utils/crypto'
import { wallet } from '../api/endpoints'

// Helper function to get auth token
const getToken = async () => {
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
  return token
}

// Async thunk for fetching user wallet balance
export const fetchUserBalance = createAsyncThunk(
  'wallet/fetchUserBalance',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken()

      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(wallet.userBalance, {
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

// Async thunk for fetching redeemable cash balance
export const fetchRedeemableCashBalance = createAsyncThunk(
  'wallet/fetchRedeemableCashBalance',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken()

      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(wallet.redeemableCashBalance, {
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
  userQoynBalance: 0,
  storeCurrency: 'AED',
  userBalance: 0,
  loading: false,
  error: null,
  success: false,
  // Cash wallet state
  redeemableCashUsd: 0,
  redeemableCashAed: 0,
  cashLoading: false,
  cashError: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearWalletData: (state) => {
      state.userQoynBalance = 0
      state.userBalance = 0
      state.storeCurrency = 'AED'
      state.error = null
    },
    updateQoynBalance: (state, action) => {
      state.userQoynBalance = action.payload
    },
    updateUserBalance: (state, action) => {
      state.userBalance = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBalance.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(fetchUserBalance.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.success
        
        if (action.payload.success && action.payload.data) {
          state.userQoynBalance = action.payload.data.userQoynBalance || 0
          state.storeCurrency = action.payload.data.storeCurrency || 'AED'
          state.userBalance = action.payload.data.userBalance || 0
        }
        state.error = null
      })
      .addCase(fetchUserBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Redeemable cash balance
      .addCase(fetchRedeemableCashBalance.pending, (state) => {
        state.cashLoading = true
        state.cashError = null
      })
      .addCase(fetchRedeemableCashBalance.fulfilled, (state, action) => {
        state.cashLoading = false
        if (action.payload.success && action.payload.data) {
          state.redeemableCashUsd = action.payload.data.redeemableCashUsd || 0
          state.redeemableCashAed = action.payload.data.redeemableCashAed || 0
        }
        state.cashError = null
      })
      .addCase(fetchRedeemableCashBalance.rejected, (state, action) => {
        state.cashLoading = false
        state.cashError = action.payload
      })
  }
})

export const { clearError, clearWalletData, updateQoynBalance, updateUserBalance } = walletSlice.actions
export default walletSlice.reducer
