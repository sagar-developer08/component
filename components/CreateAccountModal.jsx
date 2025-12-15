'use client'

import Image from 'next/image'

export default function CreateAccountModal({ open, onClose, onBackToLogin }) {
  const rules = [
    'Treat fellow contestants, production staff, and brand partners with respect and professionalism.',
    'Treat fellow contestants, production staff, and brand partners with respect and professionalism.',
    'Treat fellow contestants, production staff, and brand partners with respect and professionalism.',
    'Treat fellow contestants, production staff, and brand partners with respect and professionalism.',
    'Treat fellow contestants, production staff, and brand partners with respect and professionalism.'
  ]

  if (!open) return null

  return (
    <div className="create-modal-overlay">
      <div className="create-modal">
        <button className="create-modal-close" onClick={onClose} aria-label="Close">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#F5F5F5" />
            <path d="M9 9L19 19M19 9L9 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="create-modal-content">
          <div className="create-modal-left">
            <h1 className="create-title">Create Your Account</h1>

            <ul className="create-rules">
              {rules.map((rule, index) => (
                <li key={index} className="create-rule">
                  <span className="create-rule-number">{String(index + 1).padStart(2, '0')}</span>
                  <p className="create-rule-text">{rule}</p>
                </li>
              ))}
            </ul>

            <div className="create-qr-block">
              <div className="create-qr">
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="160" height="160" rx="12" fill="#EAF4FF" />
                  <rect x="18" y="18" width="44" height="44" rx="4" fill="white" stroke="#0078FF" strokeWidth="8" />
                  <rect x="98" y="18" width="44" height="44" rx="4" fill="white" stroke="#0078FF" strokeWidth="8" />
                  <rect x="18" y="98" width="44" height="44" rx="4" fill="white" stroke="#0078FF" strokeWidth="8" />
                  <rect x="34" y="34" width="12" height="12" fill="#0078FF" />
                  <rect x="114" y="34" width="12" height="12" fill="#0078FF" />
                  <rect x="34" y="114" width="12" height="12" fill="#0078FF" />
                  <rect x="74" y="74" width="12" height="12" fill="#0078FF" />
                  <rect x="90" y="90" width="12" height="12" fill="#0078FF" />
                  <rect x="74" y="106" width="12" height="12" fill="#0078FF" />
                  <rect x="106" y="74" width="12" height="12" fill="#0078FF" />
                  <rect x="58" y="90" width="12" height="12" fill="#0078FF" />
                  <rect x="90" y="58" width="12" height="12" fill="#0078FF" />
                  <rect x="58" y="58" width="12" height="12" fill="#0078FF" />
                  <rect x="122" y="106" width="12" height="12" fill="#0078FF" />
                  <rect x="106" y="122" width="12" height="12" fill="#0078FF" />
                  <rect x="90" y="122" width="12" height="12" fill="#0078FF" />
                  <rect x="122" y="90" width="12" height="12" fill="#0078FF" />
                  <rect x="42" y="74" width="12" height="12" fill="#0078FF" />
                  <rect x="74" y="42" width="12" height="12" fill="#0078FF" />
                  <rect x="122" y="58" width="12" height="12" fill="#0078FF" />
                  <rect x="138" y="74" width="4" height="12" fill="#0078FF" />
                  <rect x="74" y="138" width="12" height="4" fill="#0078FF" />
                  <rect x="18" y="74" width="12" height="12" fill="#0078FF" />
                  <text x="80" y="86" textAnchor="middle" fill="#0078FF" fontWeight="800" fontSize="16" fontFamily="Inter">QLIQ</text>
                </svg>
              </div>
            </div>

            <button className="create-back-btn" onClick={onBackToLogin || onClose}>
              Back to Login
            </button>
          </div>

          <div className="create-modal-right">
            <Image
              src="/1.jpg"
              alt="Joyful user"
              width={620}
              height={740}
              className="create-image"
              style={{ borderRadius: '32px', objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .create-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.18);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .create-modal {
          background: #fff;
          border-radius: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          max-width: 1100px;
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .create-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 2;
        }
        .create-modal-content {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 720px;
        }
        .create-modal-left {
          flex: 1;
          padding: 56px 48px 48px 56px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .create-title {
          font-size: 40px;
          font-weight: 700;
          margin: 0;
          color: #000;
        }
        .create-rules {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .create-rule {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .create-rule-number {
          font-weight: 700;
          font-size: 20px;
          color: #000;
          min-width: 32px;
        }
        .create-rule-text {
          font-size: 16px;
          line-height: 1.5;
          color: #1f1f1f;
          margin: 0;
        }
        .create-qr-block {
          margin-top: 12px;
          display: flex;
          justify-content: flex-start;
        }
        .create-qr {
          background: #f6faff;
          border: 1px solid #e1edff;
          border-radius: 16px;
          padding: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .create-back-btn {
          margin-top: auto;
          align-self: flex-start;
          padding: 14px 32px;
          border-radius: 999px;
          border: 1.5px solid #0078ff;
          background: #fff;
          color: #0b2c4a;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          min-width: 220px;
          transition: box-shadow 0.15s ease, transform 0.15s ease;
        }
        .create-back-btn:hover {
          box-shadow: 0 8px 24px rgba(0, 120, 255, 0.15);
          transform: translateY(-1px);
        }
        .create-modal-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 48px 48px 0;
        }
        .create-image {
          width: 100%;
          height: 100%;
          border-radius: 32px;
          object-fit: cover;
        }
        @media (max-width: 1024px) {
          .create-modal-content {
            flex-direction: column;
            height: auto;
          }
          .create-modal-left,
          .create-modal-right {
            padding: 32px;
          }
          .create-back-btn {
            align-self: stretch;
            text-align: center;
          }
        }
        @media (max-width: 640px) {
          .create-modal {
            border-radius: 16px;
            margin: 16px;
          }
          .create-title {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  )
}

