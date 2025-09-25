'use client'

import { createContext, useCallback, useContext, useMemo, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  // Keep the same API: show(message, typeOrDuration)
  // If second arg is a string, treat as type ('error'|'success'|'loading').
  // If it's a number, treat as duration for success toast.
  const show = useCallback((message, typeOrDuration) => {
    if (typeof typeOrDuration === 'string') {
      const type = typeOrDuration.toLowerCase()
      if (type === 'error') return toast.error(message)
      if (type === 'loading') return toast.loading(message)
      return toast.success(message)
    }
    if (typeof typeOrDuration === 'number') {
      return toast.success(message, { duration: typeOrDuration })
    }
    return toast.success(message)
  }, [])

  // Global event bridge for non-React contexts (e.g., Redux slices)
  useEffect(() => {
    function handleToastEvent(e) {
      const { message, type } = e.detail || {}
      if (!message) return
      if (type === 'error') return toast.error(message)
      if (type === 'loading') return toast.loading(message)
      return toast.success(message)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('app:toast', handleToastEvent)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('app:toast', handleToastEvent)
      }
    }
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster position="top-right" />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}


