import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth, addresses } from '../api/endpoints'
import { decryptText } from '../../utils/crypto'

// Fetch user profile data with aggregated information
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
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
          } catch {}
        }
      }

      const response = await fetch(`${auth.base}/profile/aggregated`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

// Set default address
export const setDefaultAddress = createAsyncThunk(
  'profile/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      let token = ''
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';').map(c => c.trim())
        const tokenCookie = cookies.find(c => c.startsWith('accessToken='))
        if (tokenCookie) {
          try {
            const enc = decodeURIComponent(tokenCookie.split('=')[1] || '')
            token = await decryptText(enc)
          } catch {}
        }
      }

      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(addresses.setDefault, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ addressId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to set default address')
      }

      return addressId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: null,
  addresses: [],
  orders: [],
  loading: false,
  error: null,
  settingDefault: false,
  defaultAddressError: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.user = null
      state.addresses = []
      state.orders = []
      state.error = null
      state.settingDefault = false
      state.defaultAddressError = null
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        // Handle the aggregated response structure
        const responseData = action.payload.data || action.payload
        state.user = responseData.profile || null
        state.addresses = responseData.addresses?.data || []
        state.orders = responseData.orders?.data || []
        state.error = null
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.user = null
        state.addresses = []
        state.orders = []
      })
      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.settingDefault = true
        state.defaultAddressError = null
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.settingDefault = false
        // Update addresses to mark the selected one as default
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === action.payload || addr.id === action.payload
        }))
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.settingDefault = false
        state.defaultAddressError = action.payload
      })
  }
})

export const { clearProfile, updateProfile } = profileSlice.actions
export default profileSlice.reducer
