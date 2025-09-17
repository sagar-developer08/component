'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
      // You can add token validation here if needed
    }
  }, [])

  const login = (userData, authToken) => {
    setToken(authToken)
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('authToken', authToken)
    setLoginModalOpen(false)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
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
