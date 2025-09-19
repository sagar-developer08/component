import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cart } from '../api/endpoints'
import { decryptText } from '@/utils/crypto'

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ userId, productId, name, price, image }, { rejectWithValue }) => {
    try {
      // Decrypt access token from cookie for Authorization header
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

      const response = await fetch(cart.wishlistAdd, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId, productId, name, price, image }),
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

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
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

      const response = await fetch(cart.wishlistGet, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state, action) => {
        state.loading = true
        state.error = null
        // Optimistically add the item so UI updates instantly
        const optimistic = action.meta?.arg
        if (optimistic && optimistic.productId) {
          const exists = state.items.some(it => it.productId === optimistic.productId)
          if (!exists) {
            state.items.unshift({
              productId: optimistic.productId,
              name: optimistic.name,
              price: optimistic.price,
              image: optimistic.image,
              addedAt: new Date().toISOString(),
              _optimistic: true,
            })
          }
        }
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        const posted = action.meta?.arg
        const serverItem = action.payload?.item
        if (serverItem && serverItem.productId) {
          // Replace optimistic item if present, else append
          const idx = state.items.findIndex(it => it.productId === serverItem.productId)
          if (idx !== -1) {
            state.items[idx] = { ...serverItem }
          } else {
            state.items.unshift(serverItem)
          }
        } else if (posted && posted.productId) {
          // Ensure we don't end up with duplicates; nothing else to do
          // since optimistic item already present
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to add to wishlist'
        // Revert optimistic add
        const failed = action.meta?.arg
        if (failed && failed.productId) {
          state.items = state.items.filter(it => it.productId !== failed.productId)
        }
      })
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        // API shape: { success, message, data: { wishlist: { items: [...] } } }
        const payload = action.payload
        state.items = payload?.data?.wishlist?.items || []
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch wishlist'
      })
  }
})

export default wishlistSlice.reducer


