import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '@/store/slices/authSlice'
import { useToast } from '@/contexts/ToastContext'
import RegisterModal from './RegisterModal'

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth()
  const dispatch = useDispatch()
  const authState = useSelector(state => state.auth)
  const { show } = useToast()
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    const email = e.currentTarget.form?.elements[0]?.value || ''
    const password = e.currentTarget.form?.elements[1]?.value || ''
    const resultAction = await dispatch(loginUser({ email, password }))
    if (loginUser.fulfilled.match(resultAction)) {
      const payload = resultAction.payload
      const token = payload?.tokens?.accessToken
      const user = payload?.user
      if (token && user) {
        login(user, token)
        show('Logged in successfully')
      }
    } else if (loginUser.rejected.match(resultAction)) {
      const errMsg = resultAction.payload || 'Login failed'
      show(typeof errMsg === 'string' ? errMsg : 'Login failed')
    }
  }

  const handleCreateAccount = (e) => {
    e.preventDefault()
    setShowRegisterModal(true) // Open registration modal (keep login modal open behind it)
  }

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false) // Close registration modal
    // Reopen login modal by calling onClose and then reopening
    // This will be handled by the parent component's state management
  }


  if (!open) return null
  return (
    <>
      <div className="login-modal-overlay">
        <div className="login-modal">
          <button className="login-modal-close" onClick={onClose}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#F5F5F5" />
              <path d="M9 9L19 19M19 9L9 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="login-modal-content">
            <div className="login-modal-left">
              <h1 className="login-title">Welcome to QLIQ</h1>
              <p className="login-desc">
                Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>
              <form className="login-form">
                <label className="login-label">Email</label>
                <input className="login-input" type="email" placeholder="Email" />
                <div className="login-password-row">
                  <label className="login-label">Password</label>
                  <span className="login-forgot">Forget password?</span>
                </div>
                <input className="login-input" type="password" placeholder="Password" />
                <div className="login-btn-row">
                  <button type="button" className="login-create-btn" onClick={handleCreateAccount}>Create Account</button>
                  <button type="submit" className="login-btn" onClick={handleLogin} disabled={authState.loading}>
                    {authState.loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
              <div className="login-divider-row">
                <hr className="login-divider" />
                <span className="login-divider-text">Login with</span>
                <hr className="login-divider" />
              </div>
              <div className="login-social-row">
                <button className="login-social-btn"><img src="/google.svg" alt="Google" /></button>
                <button className="login-social-btn"><img src="/facebook.svg" alt="Facebook" /></button>
                <button className="login-social-btn"><img src="/tiktok.svg" alt="TikTok" /></button>
                <button className="login-social-btn"><img src="/insta.svg" alt="Instagram" /></button>
              </div>
            </div>
            <div className="login-modal-right">
              <Image
                src="/loginImage.jpg"
                alt="Login"
                width={610}
                height={740}
                className="login-image"
                style={{ borderRadius: '32px', objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <RegisterModal 
        open={showRegisterModal}
        onClose={onClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
      
      <style jsx>{`
        .login-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.18);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-modal {
          background: #fff;
          border-radius: 32px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          max-width: 900px;
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .login-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 2;
        }
        .login-modal-content {
          display: flex;
          flex-direction: row;
          width: 100%;
          min-height: 480px;
        }
        .login-modal-left {
          flex: 1;
          padding: 48px 40px 48px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-title {
          font-size: 40px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #000;
        }
        .login-desc {
          font-size: 16px;
          color: #000;
          margin-bottom: 32px;
          line-height: 150%;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .login-label {
          font-size: 16px;
          color: #222;
          font-weight: 600;
        }
        .login-input {
          width: 100%;
          border: 1px solid #E5E5E5;
          border-radius: 16px;
          padding: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #222;
          margin-bottom: 8px;
        }
        .login-password-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .login-forgot {
          font-size: 14px;
          color: #888;
          cursor: pointer;
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
        .login-divider-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 32px 0 16px 0;
        }
        .login-divider {
          flex: 1;
          border: none;
          border-top: 1px solid #E5E5E5;
        }
        .login-divider-text {
          font-size: 14px;
          color: #888;
          font-weight: 500;
        }
        .login-social-row {
          display: flex;
          justify-content: center;
          gap: 24px;
        }
        .login-social-btn {
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
        .login-social-btn:hover {
          box-shadow: 0 2px 8px rgba(0,130,255,0.12);
        }
        .login-modal-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 48px 48px 0;
        }
        .login-image {
          width: 100%;
          height: 100%;
          border-radius: 32px;
          object-fit: cover;
        }
        @media (max-width: 900px) {
          .login-modal-content {
            flex-direction: column;
          }
          .login-modal-left, .login-modal-right {
            padding: 32px;
          }
        }
        @media (max-width: 600px) {
          .login-modal {
            border-radius: 16px;
          }
          .login-modal-content {
            min-height: 0;
          }
          .login-modal-left, .login-modal-right {
            padding: 16px;
          }
        }
      `}</style>
    </>
  )
}