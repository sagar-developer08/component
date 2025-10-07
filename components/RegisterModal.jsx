import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '@/store/slices/authSlice'
import { useToast } from '@/contexts/ToastContext'
import { Country } from 'country-state-city'

export default function RegisterModal({ open, onClose, onSwitchToLogin }) {
  const { login } = useAuth()
  const dispatch = useDispatch()
  const authState = useSelector(state => state.auth)
  const { show } = useToast()
  
  // Get all countries for nationality dropdown
  const countries = Country.getAllCountries()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    nationality: ''
  })

  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      gender: '',
      nationality: ''
    })
    setErrors({})
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // For phone field, only allow digits and limit to 8 characters
    if (name === 'phone') {
      const phoneRegex = /^[0-9]*$/
      if (!phoneRegex.test(value)) {
        return // Don't update if invalid characters
      }
      if (value.length > 8) {
        return // Don't update if more than 8 digits
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate email and phone in real-time
    const newErrors = { ...errors }
    
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        newErrors.email = 'Please enter a valid email address'
      } else {
        newErrors.email = ''
      }
    } else if (name === 'phone') {
      if (value && value.length < 8) {
        newErrors.phone = 'Please enter a valid 8-digit phone number'
      } else {
        newErrors.phone = ''
      }
    } else if (errors[name]) {
      // Clear error for other fields when user starts typing
      newErrors[name] = ''
    }
    
    setErrors(newErrors)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }


    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (formData.phone.length !== 8) {
      newErrors.phone = 'Phone number must be exactly 8 digits'
    }


    if (!formData.gender) {
      newErrors.gender = 'Gender is required'
    }

    if (!formData.nationality) {
      newErrors.nationality = 'Nationality is required'
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const resultAction = await dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      gender: formData.gender,
      nationality: formData.nationality
    }))

    if (registerUser.fulfilled.match(resultAction)) {
      const payload = resultAction.payload
      const token = payload?.tokens?.accessToken
      const user = payload?.user
      if (token && user) {
        login(user, token, true) // Skip the "Logged in" toast
        show('Account created successfully!')
        // Reset form data before closing
        resetForm()
        onClose()
      }
    } else if (registerUser.rejected.match(resultAction)) {
      const errMsg = resultAction.payload || 'Registration failed'
      show(typeof errMsg === 'string' ? errMsg : 'Registration failed')
    }
  }

  const handleRegisterModalClose = () => {
    resetForm()
    onClose()
  }

  const handleBackToLogin = () => {
    resetForm() // Reset register form when switching to login
    onSwitchToLogin()
  }

  if (!open) return null

  return (
    <div className="register-modal-overlay">
      <div className="register-modal">
        <button className="register-modal-close" onClick={handleRegisterModalClose}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#F5F5F5" />
            <path d="M9 9L19 19M19 9L9 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="register-modal-content">
          <div className="register-modal-left">
            <h1 className="register-title">Create Your Account</h1>
            <form className="register-form" onSubmit={handleRegister}>
              <div className="register-field">
                <label className="register-label">Name</label>
                <input
                  className={`register-input ${errors.name ? 'register-input-error' : ''}`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                />
                {errors.name && <span className="register-error">{errors.name}</span>}
              </div>

              <div className="register-field">
                <label className="register-label">Email</label>
                <input
                  className={`register-input ${errors.email ? 'register-input-error' : ''}`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
                {errors.email && <span className="register-error">{errors.email}</span>}
              </div>

              <div className="register-field">
                <label className="register-label">Phone Number</label>
                <input
                  className={`register-input ${errors.phone ? 'register-input-error' : ''}`}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
                {errors.phone && <span className="register-error">{errors.phone}</span>}
              </div>

              <div className="register-field">
                <label className="register-label">Password</label>
                <input
                  className={`register-input ${errors.password ? 'register-input-error' : ''}`}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                />
                {errors.password && <span className="register-error">{errors.password}</span>}
              </div>

              <div className="register-name-row">
                <div className="register-name-field">
                  <label className="register-label">Gender</label>
                  <select
                    className={`register-input ${errors.gender ? 'register-input-error' : ''}`}
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {errors.gender && <span className="register-error">{errors.gender}</span>}
                </div>
                <div className="register-name-field">
                  <label className="register-label">Nationality</label>
                  <select
                    className={`register-input ${errors.nationality ? 'register-input-error' : ''}`}
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Nationality</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.nationality && <span className="register-error">{errors.nationality}</span>}
                </div>
              </div>

              <div className="login-btn-row">
                <button type="button" className="login-create-btn" onClick={handleBackToLogin}>Back</button>
                <button type="submit" className="login-btn" disabled={authState.loading}>
                  {authState.loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
          <div className="register-modal-right">
            <Image
              src="/loginImage.jpg"
              alt="Register"
              width={610}
              height={740}
              className="register-image"
              style={{ borderRadius: '32px', objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .register-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.18);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .register-modal {
           background: #fff;
          border-radius: 32px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          max-width: 900px;
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .register-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 2;
        }
        .register-modal-content {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 700px;
        }
        .register-modal-left {
          flex: 1;
          padding: 48px 40px 48px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .register-title {
          font-size: 40px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #000;
        }
        .register-desc {
          font-size: 16px;
          color: #000;
          margin-bottom: 32px;
          line-height: 150%;
        }
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .register-name-row {
          display: flex;
          gap: 16px;
        }
        .register-name-field {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .register-field {
          display: flex;
          flex-direction: column;
        }
        .register-label {
          font-size: 16px;
          color: #222;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .register-input {
          width: 100%;
          border: 1px solid #E5E5E5;
          border-radius: 12px;
          padding: 12px;
          font-size: 16px;
          font-weight: 500;
          color: #222;
          transition: border-color 0.2s;
        }
        .register-input:focus {
          outline: none;
          border-color: #0082FF;
        }
        .register-input-error {
          border-color: #FF4444;
        }
        .register-error {
          color: #FF4444;
          font-size: 14px;
          margin-top: 4px;
        }
        .register-terms {
          margin: 8px 0;
        }
        .register-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }
        .register-checkbox {
          margin-top: 2px;
          width: 18px;
          height: 18px;
          accent-color: #0082FF;
        }
        .register-checkbox-text {
          font-size: 14px;
          color: #666;
          line-height: 140%;
        }
        .register-link {
          color: #0082FF;
          text-decoration: none;
        }
        .register-link:hover {
          text-decoration: underline;
        }
        .login-btn-row {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }
        .login-create-btn,
        .login-btn {
          min-width: 200px;
          width: 200px;
          text-align: center;
        }
        .login-create-btn {
          background: #fff;
          border: 1px solid #0082FF;
          color: #000;
          border-radius: 100px;
          padding: 12px 32px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
        }
        .login-btn {
          background: #CBE6FF;
          color: #0082FF;
          border-radius: 100px;
          border: none;
          padding: 12px 32px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
        }
        .register-divider-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 32px 0 16px 0;
        }
        .register-divider {
          flex: 1;
          border: none;
          border-top: 1px solid #E5E5E5;
        }
        .register-divider-text {
          font-size: 14px;
          color: #888;
          font-weight: 500;
        }
        .register-social-row {
          display: flex;
          justify-content: center;
          gap: 24px;
        }
        .register-social-btn {
          background: #fff;
          border: 1px solid #E5E5E5;
          border-radius: 100px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.2s;
        }
        .register-social-btn:hover {
          box-shadow: 0 2px 8px rgba(0,130,255,0.12);
        }
        .register-modal-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 48px 48px 0;
        }
        .register-image {
          width: 100%;
          height: 100%;
          border-radius: 32px;
          object-fit: cover;
        }
        @media (max-width: 900px) {
          .register-modal-content {
            flex-direction: column;
          }
          .register-modal-left, .register-modal-right {
            padding: 32px;
          }
          .register-name-row {
            flex-direction: column;
            gap: 16px;
          }
        }
        @media (max-width: 600px) {
          .register-modal {
            border-radius: 16px;
            margin: 16px;
          }
          .register-modal-content {
            min-height: 0;
          }
          .register-modal-left, .register-modal-right {
            padding: 16px;
          }
          .register-title {
            font-size: 32px;
          }
          .register-btn-row {
            flex-direction: column;
            align-items: stretch;
          }
          .register-btn {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  )
}
