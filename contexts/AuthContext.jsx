'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCart } from '@/store/slices/cartSlice'
import { fetchWishlist } from '@/store/slices/wishlistSlice'
import { fetchProfile } from '@/store/slices/profileSlice'
import { getUserFromCookies } from '@/utils/userUtils'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  
  // Use a safe toast function that won't break if ToastProvider isn't available
  const showToast = (message, type = 'success') => {
    if (typeof window !== 'undefined') {
      const ev = new CustomEvent('app:toast', { detail: { message, type } })
      window.dispatchEvent(ev)
    }
  }
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check for existing token on mount and load user data if authenticated
  useEffect(() => {
    // Do not use localStorage for tokens. Optionally, restore session from cognitoId cookie.
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').map(c => c.trim())
      const cognitoCookie = cookies.find(c => c.startsWith('cognitoId='))
      const tokenCookie = cookies.find(c => c.startsWith('accessToken='))
      if (cognitoCookie || tokenCookie) {
        setIsAuthenticated(true)
        
        // Load user's cart, wishlist, and profile data if already authenticated
        const loadUserData = async () => {
          try {
            const userId = await getUserFromCookies()
            if (userId) {
              dispatch(fetchCart(userId))
            }
            dispatch(fetchWishlist())
            dispatch(fetchProfile())
          } catch (e) {
            console.error('Failed to load user data on app init:', e)
          }
        }
        loadUserData()
      }
    }
    setIsInitialized(true)
  }, [dispatch])

  const login = async (userData, authToken, skipToast = false) => {
    setToken(authToken)
    setUser(userData)
    setIsAuthenticated(true)
    setLoginModalOpen(false)
    
    // Fetch user's cart, wishlist, and profile data immediately after login
    try {
      const userId = await getUserFromCookies()
      if (userId) {
        dispatch(fetchCart(userId))
      }
      dispatch(fetchWishlist())
      dispatch(fetchProfile())
    } catch (e) {
      console.error('Failed to load user data after login:', e)
    }
    
    if (!skipToast) {
      showToast('Logged in')
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    if (typeof document !== 'undefined') {
      document.cookie = 'cognitoId=; Max-Age=0; Path=/; SameSite=Lax'
      document.cookie = 'accessToken=; Max-Age=0; Path=/; SameSite=Lax'
    }
    // Broadcast an event so interested slices/components can clear auth-dependent state
    if (typeof window !== 'undefined') {
      const ev = new CustomEvent('app:logout')
      window.dispatchEvent(ev)
    }
    showToast('Logged out')
  }

  const openLoginModal = () => {
    setLoginModalOpen(true)
  }

  const closeLoginModal = () => {
    setLoginModalOpen(false)
  }

  const requireAuth = (callback) => {
    if (isAuthenticated) {
      callback()
    } else {
      openLoginModal()
    }
  }

  const value = {
    isAuthenticated,
    token,
    user,
    loginModalOpen,
    isInitialized,
    login,
    logout,
    openLoginModal,
    closeLoginModal,
    requireAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
