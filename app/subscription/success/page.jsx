'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import styles from './success.module.css'

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams()
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading')
  const [subscriptionData, setSubscriptionData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleSubscriptionSuccess = async () => {
      try {
        // Get session_id from URL params
        const sessionId = searchParams.get('session_id')
        
        console.log('Subscription success URL params:', { sessionId })
        
        if (!sessionId) {
          setError('Invalid subscription confirmation - missing session parameters')
          setSubscriptionStatus('error')
          return
        }

        console.log('Subscription successful via Stripe session:', sessionId)
        
        // Get subscription data from sessionStorage
        const storedData = sessionStorage.getItem('subscriptionData')
        let subscriptionInfo = null
        
        if (storedData) {
          try {
            subscriptionInfo = JSON.parse(storedData)
            // Clear the stored data after reading
            sessionStorage.removeItem('subscriptionData')
          } catch (e) {
            console.warn('Failed to parse stored subscription data:', e)
          }
        }
        
        // Set success status with session data
        setSubscriptionData({
          sessionId,
          status: 'completed',
          message: 'Your QLIQ Plus subscription has been activated successfully!',
          amount: subscriptionInfo?.amount || 100,
          tier: subscriptionInfo?.tier || 'plus',
          subscription: subscriptionInfo?.subscription
        })
        setSubscriptionStatus('success')
        
      } catch (error) {
        console.error('Subscription confirmation error:', error)
        setError(error.message)
        setSubscriptionStatus('error')
      }
    }

    handleSubscriptionSuccess()
  }, [searchParams])

  if (subscriptionStatus === 'loading') {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
            </div>
            <h2 className={styles.loadingTitle}>Activating your subscription...</h2>
            <p className={styles.loadingText}>Please wait while we activate your QLIQ Plus subscription.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (subscriptionStatus === 'error') {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>
              <div className={styles.errorCircle}>
                <span>✕</span>
              </div>
            </div>
            <h2 className={styles.errorTitle}>Subscription Failed</h2>
            <p className={styles.errorMessage}>{error}</p>
            <div className={styles.errorActions}>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.href = '/profile'}
              >
                <span>Try Again</span>
              </button>
              <button 
                className={styles.homeButton}
                onClick={() => window.location.href = '/'}
              >
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.successContainer}>
          {/* Success Animation */}
          <div className={styles.successAnimation}>
            <div className={styles.checkmarkContainer}>
              <div className={styles.checkmark}>
                <div className={styles.checkmarkCircle}></div>
                <div className={styles.checkmarkStem}></div>
                <div className={styles.checkmarkKick}></div>
              </div>
            </div>
            <div className={styles.confetti}>
              <div className={styles.confettiPiece}></div>
              <div className={styles.confettiPiece}></div>
              <div className={styles.confettiPiece}></div>
              <div className={styles.confettiPiece}></div>
              <div className={styles.confettiPiece}></div>
            </div>
          </div>

          {/* Success Content */}
          <div className={styles.successContent}>
            <h1 className={styles.successTitle}>Subscription Successful!</h1>
            <p className={styles.successMessage}>
              Welcome to QLIQ Plus! Your subscription has been activated and you now have access to all premium features.
            </p>
            
            {/* Subscription Details Card */}
            {subscriptionData && (
              <div className={styles.subscriptionCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.cardIcon}>⭐</span>
                    QLIQ Plus Subscription
                  </h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.subscriptionRow}>
                    <span className={styles.subscriptionLabel}>Plan:</span>
                    <span className={styles.subscriptionValue}>QLIQ {subscriptionData.tier?.charAt(0).toUpperCase() + subscriptionData.tier?.slice(1)}</span>
                  </div>
                  {subscriptionData.amount && (
                    <div className={styles.subscriptionRow}>
                      <span className={styles.subscriptionLabel}>Amount:</span>
                      <span className={styles.subscriptionValue}>${subscriptionData.amount}</span>
                    </div>
                  )}
                  <div className={styles.subscriptionRow}>
                    <span className={styles.subscriptionLabel}>Status:</span>
                    <span className={styles.statusBadge}>
                      {subscriptionData.status}
                    </span>
                  </div>
                  <div className={styles.subscriptionRow}>
                    <span className={styles.subscriptionLabel}>Session ID:</span>
                    <span className={styles.subscriptionValue}>
                      {subscriptionData.sessionId}
                    </span>
                  </div>
                  {subscriptionData.message && (
                    <div className={styles.subscriptionMessage}>
                      {subscriptionData.message}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Benefits Section */}
            <div className={styles.benefitsSection}>
              <h3 className={styles.benefitsTitle}>Your QLIQ Plus Benefits</h3>
              <div className={styles.benefitsList}>
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>🚀</span>
                  <span className={styles.benefitText}>Exclusive deals and discounts</span>
                </div>
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>⚡</span>
                  <span className={styles.benefitText}>Priority customer support</span>
                </div>
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>🎯</span>
                  <span className={styles.benefitText}>Early access to new features</span>
                </div>
                <div className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>💎</span>
                  <span className={styles.benefitText}>Premium shopping experience</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button 
                className={styles.primaryButton}
                onClick={() => window.location.href = '/profile'}
              >
                <span>Go to Profile</span>
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => window.location.href = '/'}
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
