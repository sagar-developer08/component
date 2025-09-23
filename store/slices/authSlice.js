import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth } from '../api/endpoints'
import { encryptText } from '@/utils/crypto'

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `HTTP error ${response.status}`)
      }

      const data = await response.json()
      console.log('Register API response:', data)

      // Persist cognito id and accessToken in cookies (client-side), encrypted
      if (typeof document !== 'undefined') {
        const maxAge = data?.tokens?.expiresIn ? Number(data.tokens.expiresIn) : 60 * 60 * 24
        if (data?.user?.cognitoUserId) {
          const encId = await encryptText(String(data.user.cognitoUserId))
          document.cookie = `cognitoId=${encodeURIComponent(encId)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
        }
        if (data?.user?.id) {
          const encUser = await encryptText(String(data.user.id))
          document.cookie = `userId=${encodeURIComponent(encUser)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
        }
        if (data?.tokens?.accessToken) {
          const encTok = await encryptText(String(data.tokens.accessToken))
          document.cookie = `accessToken=${encodeURIComponent(encTok)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
        }
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Register thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, phone, dateOfBirth, gender, nationality }, { rejectWithValue }) => {
    try {
      // Prepare the payload according to the API specification
      const payload = {
        email,
        password,
        name,
        phone,
        role: "user", // Default role as specified
        nationality,
        gender
      }

      console.log('Register API call:', {
        url: auth.register,
        payload
      })

      const response = await fetch(auth.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `HTTP error ${response.status}`)
      }

      const data = await response.json()
      console.log('Register API response:', data)

      // Persist cognito id and accessToken in cookies (client-side), encrypted
      if (typeof document !== 'undefined') {
        const maxAge = data?.tokens?.expiresIn ? Number(data.tokens.expiresIn) : 60 * 60 * 24
        if (data?.user?.cognitoUserId) {
          const encId = await encryptText(String(data.user.cognitoUserId))
          document.cookie = `cognitoId=${encodeURIComponent(encId)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
        }
        if (data?.user?.id) {
          const encUser = await encryptText(String(data.user.id))
          document.cookie = `userId=${encodeURIComponent(encUser)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
        }
        if (data?.tokens?.accessToken) {
          const encTok = await encryptText(String(data.tokens.accessToken))
          document.cookie = `accessToken=${encodeURIComponent(encTok)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
        }
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    tokens: null,
    platform: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.tokens = null
      state.platform = null
      state.isAuthenticated = false
      if (typeof document !== 'undefined') {
        document.cookie = 'cognitoId=; Max-Age=0; Path=/; SameSite=Lax'
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken')
      }
    },
    clearAuthError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.isAuthenticated = true
        state.user = action.payload?.user || null
        state.tokens = action.payload?.tokens || null
        state.platform = action.payload?.platform || null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
        state.isAuthenticated = false
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.isAuthenticated = true
        state.user = action.payload?.user || null
        state.tokens = action.payload?.tokens || null
        state.platform = action.payload?.platform || null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Registration failed'
        state.isAuthenticated = false
      })
  }
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer


