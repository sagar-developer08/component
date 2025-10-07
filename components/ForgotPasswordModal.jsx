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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
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

    // TODO: Call API to send OTP to email
    try {
      // Simulated API call
      show('OTP sent to your email')
      setStep(2)
    } catch (error) {
      show('Failed to send OTP', 'error')
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

    // TODO: Call API to reset password
    try {
      // Simulated API call
      show('Password reset successfully')
      handleModalClose()
    } catch (error) {
      show('Failed to reset password', 'error')
    }
  }

  const handleModalClose = () => {
    setFormData({ email: '', otp: '', password: '', confirmPassword: '' })
    setErrors({ email: '', otp: '', password: '', confirmPassword: '' })
    setStep(1)
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
                  <button type="button" className="forgot-back-btn" onClick={handleModalClose}>
                    Back
                  </button>
                  <button type="submit" className="forgot-submit-btn">
                    Send OTP
                  </button>
                </div>
              </form>
            ) : (
              <form className="forgot-form" onSubmit={handleResetPassword}>
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
                  <label className="forgot-label">Password</label>
                  <input 
                    className={`forgot-input ${errors.password ? 'forgot-input-error' : ''}`}
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password" 
                  />
                  {errors.password && <span className="forgot-error">{errors.password}</span>}
                </div>
                
                <div className="forgot-field">
                  <label className="forgot-label">Confirm Password</label>
                  <input 
                    className={`forgot-input ${errors.confirmPassword ? 'forgot-input-error' : ''}`}
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password" 
                  />
                  {errors.confirmPassword && <span className="forgot-error">{errors.confirmPassword}</span>}
                </div>
                
                <div className="forgot-btn-row">
                  <button type="button" className="forgot-back-btn" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button type="submit" className="forgot-submit-btn">
                    Reset Password
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
        .forgot-error {
          color: #FF4444;
          font-size: 14px;
          margin-top: 4px;
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

