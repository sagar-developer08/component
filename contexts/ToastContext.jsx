'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, duration = 2000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport">
        {toasts.map(t => (
          <div key={t.id} className="toast-item">{t.message}</div>
        ))}
      </div>
      <style jsx>{`
        .toast-viewport {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 100000;
          pointer-events: none;
        }
        .toast-item {
          background: #111;
          color: #fff;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 600;
          animation: dropIn 0.25s ease-out;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }
        @keyframes dropIn {
          from { transform: translateY(-120%); opacity: 0; }
          to { transform: translateY(12px); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}


