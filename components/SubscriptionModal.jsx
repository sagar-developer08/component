import { useState } from 'react'

export default function SubscriptionModal({ open, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState('plus')

  const handleUpgrade = (plan) => {
    // TODO: Implement upgrade functionality
    console.log(`Upgrading to ${plan} plan`)
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="subscription-modal-overlay">
        <div className="subscription-modal">
          <button className="subscription-modal-close" onClick={onClose}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#F5F5F5" />
              <path d="M9 9L19 19M19 9L9 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          
          <div className="subscription-modal-content">
            <h1 className="subscription-title">Upgrade Account</h1>
            
            <div className="subscription-plans">
              {/* Plus Plan */}
              <div className={`subscription-plan ${selectedPlan === 'plus' ? 'selected' : ''}`}>
                <div className="plan-header">
                  <h3 className="plan-name plus">Plus</h3>
                  <div className="plan-price">$100</div>
                  <div className="plan-billing">per user/year</div>
                </div>
                
                <div className="plan-features">
                  <h4 className="features-title">Features</h4>
                  <ul className="features-list">
                    <li className="feature-item">
                      <svg className="checkmark plus" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#0082FF" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark plus" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#0082FF" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark plus" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#0082FF" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark plus" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#0082FF" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark plus" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#0082FF" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                  </ul>
                </div>
                
                <button 
                  className="upgrade-btn plus"
                  onClick={() => handleUpgrade('plus')}
                >
                  Upgrade Now
                </button>
              </div>

              {/* Silver Plan */}
              <div className={`subscription-plan silver ${selectedPlan === 'silver' ? 'selected' : ''}`}>
                <div className="plan-header">
                  <h3 className="plan-name silver">Silver</h3>
                  <div className="plan-price">$365</div>
                  <div className="plan-billing">per user/year</div>
                </div>
                
                <div className="plan-features">
                  <h4 className="features-title">Features</h4>
                  <ul className="features-list">
                    <li className="feature-item">
                      <svg className="checkmark silver" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#C5C5C5" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark silver" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#C5C5C5" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark silver" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#C5C5C5" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark silver" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#C5C5C5" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark silver" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#C5C5C5" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                  </ul>
                </div>
                
                <button 
                  className="upgrade-btn silver"
                  onClick={() => handleUpgrade('silver')}
                >
                  Upgrade Now
                </button>
              </div>

              {/* Gold Plan */}
              <div className={`subscription-plan gold ${selectedPlan === 'gold' ? 'selected' : ''}`}>
                <div className="plan-header">
                  <h3 className="plan-name gold">Gold</h3>
                  <div className="plan-price">$3650</div>
                  <div className="plan-billing">per user/year</div>
                </div>
                
                <div className="plan-features">
                  <h4 className="features-title">Features</h4>
                  <ul className="features-list">
                    <li className="feature-item">
                      <svg className="checkmark gold" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#FFD700" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark gold" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#FFD700" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark gold" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#FFD700" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark gold" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#FFD700" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                    <li className="feature-item">
                      <svg className="checkmark gold" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#FFD700" />
                        <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Lorem ipsum dolor sit a onsectetur adipiscing elit.</span>
                    </li>
                  </ul>
                </div>
                
                <button 
                  className="upgrade-btn gold"
                  onClick={() => handleUpgrade('gold')}
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .subscription-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.18);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .subscription-modal {
          background: #fff;
          border-radius: 24px;
          max-width: 1200px;
          width: 100%;
          max-height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1000000;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .subscription-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1000001;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subscription-modal-content {
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .subscription-title {
          font-size: 32px;
          font-weight: 700;
          color: #000;
          margin: 0 0 16px 0;
          text-align: center;
        }

        .subscription-plans {
          display: flex;
          gap: 24px;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }

        .subscription-plan {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #c5c5c5;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 280px;
          max-width: 320px;
          flex: 1;
          position: relative;
          transition: all 0.2s ease;
        }

        .subscription-plan.plus {
          border-color: #0082FF;
        }

        .subscription-plan.silver {
          border-color: #C5C5C5;
        }

        .subscription-plan.gold {
          border-color: #FFD700;
        }

        .plan-header {
          width: 100%;
          margin-bottom: 16px;
        }

        .plan-name {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .plan-name.plus {
          color: #0082FF;
        }

        .plan-name.silver {
          color: #C5C5C5;
        }

        .plan-name.gold {
          color: #FFD700;
        }

        .plan-price {
          font-size: 36px;
          font-weight: 600;
          color: #000;
          margin: 0 0 4px 0;
        }

        .plan-billing {
          font-size: 14px;
          color: #000;
          font-weight: 400;
        }

        .plan-features {
          width: 100%;
          margin-bottom: 24px;
          flex: 1;
        }

        .features-title {
          font-size: 18px;
          font-weight: 600;
          color: #000;
          margin: 0 0 8px 0;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: #000;
          line-height: 1.4;
        }

        .checkmark {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .upgrade-btn {
          width: 100%;
          padding: 16px 24px;
          border-radius: 32px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: auto;
        }

        .upgrade-btn.plus {
          background: #0082FF;
          color: #fff;
        }

        .upgrade-btn.silver {
          background: #C5C5C5;
          color: #fff;
        }

        .upgrade-btn.gold {
          background: #FFD700;
          color: #fff;
        }

        @media (max-width: 768px) {
          .subscription-modal {
            margin: 20px;
            max-width: calc(100vw - 40px);
          }

          .subscription-modal-content {
            padding: 40px 20px 20px;
          }

          .subscription-title {
            font-size: 24px;
            margin-bottom: 24px;
          }

          .subscription-plans {
            flex-direction: column;
            gap: 16px;
          }

          .subscription-plan {
            min-width: auto;
            max-width: none;
            padding: 24px 20px;
          }
        }
      `}</style>
    </>
  )
}
