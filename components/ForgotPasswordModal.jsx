import Image from 'next/image'
import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

export default function ForgotPasswordModal({ open, onClose }) {
  const { show } = useToast()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP + Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  })

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    
    if (!formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }))
      return
    }
    
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('https://backendauth.qliq.ae/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      // Success - show message and move to step 2
      show(data.message || 'OTP sent to your email successfully')
      setStep(2)
      
    } catch (error) {
      console.error('Forgot password error:', error)
      setErrors(prev => ({ 
        ...prev, 
        email: error.message || 'Failed to send OTP. Please try again.' 
      }))
      show(error.message || 'Failed to send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    
    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://backendauth.qliq.ae/api/auth/confirm-forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          confirmationCode: formData.otp,
          newPassword: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password')
      }

      // Success - show message and close modal
      show(data.message || 'Password reset successfully!')
      handleModalClose()
      
    } catch (error) {
      console.error('Reset password error:', error)
      
      // Set appropriate error message
      const errorMessage = error.message || 'Failed to reset password. Please try again.'
      
      // Check if it's an OTP error
      if (errorMessage.toLowerCase().includes('code') || errorMessage.toLowerCase().includes('otp')) {
        setErrors(prev => ({ ...prev, otp: errorMessage }))
      } else {
        setErrors(prev => ({ ...prev, password: errorMessage }))
      }
      
      show(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setFormData({ email: '', otp: '', password: '', confirmPassword: '' })
    setErrors({ email: '', otp: '', password: '', confirmPassword: '' })
    setStep(1)
    setLoading(false)
    setShowPasswords({ password: false, confirmPassword: false })
    onClose()
  }

  if (!open) return null

  return (
    <div className="forgot-modal-overlay">
      <div className="forgot-modal">
        <button className="forgot-modal-close" onClick={handleModalClose}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#F5F5F5" />
            <path d="M9 9L19 19M19 9L9 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="forgot-modal-content">
          <div className="forgot-modal-left">
            <h1 className="forgot-title">Reset Your Password</h1>
            <p className="forgot-desc">
              {step === 1 
                ? 'Enter your email address and we will send you an OTP to reset your password.'
                : 'Enter the OTP sent to your email and create a new password.'}
            </p>
            
            {step === 1 ? (
              <form className="forgot-form" onSubmit={handleSendOTP}>
                <div className="forgot-field">
                  <label className="forgot-label">Email</label>
                  <input 
                    className={`forgot-input ${errors.email ? 'forgot-input-error' : ''}`}
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email" 
                  />
                  {errors.email && <span className="forgot-error">{errors.email}</span>}
                </div>
                
                <div className="forgot-btn-row">
                  <button type="button" className="forgot-back-btn" onClick={handleModalClose} disabled={loading}>
                    Back
                  </button>
                  <button type="submit" className="forgot-submit-btn" disabled={loading}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form className="forgot-form" onSubmit={handleResetPassword}>
                <div className="forgot-field">
                  <label className="forgot-label">Email</label>
                  <input 
                    className="forgot-input forgot-input-readonly"
                    type="email" 
                    value={formData.email}
                    readOnly
                    disabled
                  />
                </div>

                <div className="forgot-field">
                  <label className="forgot-label">OTP</label>
                  <input 
                    className={`forgot-input ${errors.otp ? 'forgot-input-error' : ''}`}
                    type="text" 
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP" 
                    maxLength={6}
                  />
                  {errors.otp && <span className="forgot-error">{errors.otp}</span>}
                </div>
                
                <div className="forgot-field">
                  <label className="forgot-label">New Password</label>
                  <div className="forgot-password-wrapper">
                    <input 
                      className={`forgot-input ${errors.password ? 'forgot-input-error' : ''}`}
                      type={showPasswords.password ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password" 
                    />
                    <button
                      type="button"
                      className="forgot-eye-button"
                      onClick={() => togglePasswordVisibility('password')}
                    >
                      {showPasswords.password ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <span className="forgot-error">{errors.password}</span>}
                </div>
                
                <div className="forgot-field">
                  <label className="forgot-label">Confirm Password</label>
                  <div className="forgot-password-wrapper">
                    <input 
                      className={`forgot-input ${errors.confirmPassword ? 'forgot-input-error' : ''}`}
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password" 
                    />
                    <button
                      type="button"
                      className="forgot-eye-button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                    >
                      {showPasswords.confirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="forgot-error">{errors.confirmPassword}</span>}
                </div>
                
                <div className="forgot-btn-row">
                  <button 
                    type="button" 
                    className="forgot-back-btn" 
                    onClick={() => {
                      setStep(1)
                      setShowPasswords({ password: false, confirmPassword: false })
                    }} 
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button type="submit" className="forgot-submit-btn" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="forgot-modal-right">
            <Image
              src="/loginImage.jpg"
              alt="Reset Password"
              width={610}
              height={740}
              className="forgot-image"
              style={{ borderRadius: '32px', objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .forgot-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.18);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .forgot-modal {
          background: #fff;
          border-radius: 32px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          max-width: 900px;
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .forgot-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 2;
        }
        .forgot-modal-content {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 700px;
        }
        .forgot-modal-left {
          flex: 1;
          padding: 48px 40px 48px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .forgot-title {
          font-size: 40px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #000;
        }
        .forgot-desc {
          font-size: 16px;
          color: #000;
          margin-bottom: 32px;
          line-height: 150%;
        }
        .forgot-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .forgot-field {
          display: flex;
          flex-direction: column;
        }
        .forgot-label {
          font-size: 16px;
          color: #222;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .forgot-input {
          width: 100%;
          border: 1px solid #E5E5E5;
          border-radius: 12px;
          padding: 12px;
          font-size: 16px;
          font-weight: 500;
          color: #222;
          transition: border-color 0.2s;
        }
        .forgot-input:focus {
          outline: none;
          border-color: #0082FF;
        }
        .forgot-input-error {
          border-color: #FF4444;
        }
        .forgot-input-readonly {
          background: #F5F5F5;
          color: #666;
          cursor: not-allowed;
        }
        .forgot-error {
          color: #FF4444;
          font-size: 14px;
          margin-top: 4px;
        }
        .forgot-password-wrapper {
          position: relative;
          width: 100%;
        }
        .forgot-password-wrapper .forgot-input {
          padding-right: 48px;
        }
        .forgot-eye-button {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          transition: color 0.2s;
        }
        .forgot-eye-button:hover {
          color: #0082FF;
        }
        .forgot-eye-button svg {
          width: 20px;
          height: 20px;
        }
        .forgot-btn-row {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }
        .forgot-back-btn,
        .forgot-submit-btn {
          min-width: 200px;
          width: 200px;
          text-align: center;
        }
        .forgot-back-btn {
          background: #fff;
          border: 1px solid #0082FF;
          color: #000;
          border-radius: 100px;
          padding: 12px 32px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
        }
        .forgot-submit-btn {
          background: #CBE6FF;
          color: #0082FF;
          border-radius: 100px;
          border: none;
          padding: 12px 32px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .forgot-submit-btn:disabled,
        .forgot-back-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .forgot-modal-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 48px 48px 0;
        }
        .forgot-image {
          width: 100%;
          height: 100%;
          border-radius: 32px;
          object-fit: cover;
        }
        @media (max-width: 900px) {
          .forgot-modal-content {
            flex-direction: column;
            height: auto;
          }
          .forgot-modal-left, .forgot-modal-right {
            padding: 32px;
          }
        }
        @media (max-width: 600px) {
          .forgot-modal {
            border-radius: 16px;
            margin: 16px;
          }
          .forgot-modal-content {
            min-height: 0;
          }
          .forgot-modal-left, .forgot-modal-right {
            padding: 16px;
          }
          .forgot-title {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  )
}

