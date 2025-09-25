'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getAuthToken } from '@/utils/userUtils'
import styles from '../checkout.module.css'
import successStyles from './success.module.css'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState('loading')
  const [paymentData, setPaymentData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Check for session_id (from Stripe redirect) or payment_intent (from direct payment)
        const sessionId = searchParams.get('session_id')
        const paymentIntentId = searchParams.get('payment_intent')
        const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret')
        
        console.log('URL params:', { sessionId, paymentIntentId, paymentIntentClientSecret })
        
        // If we have session_id, confirm with backend and create order
        if (sessionId) {
          console.log('Payment successful via Stripe session:', sessionId)
          
          const token = await getAuthToken()
          if (!token) {
            setError('Authentication required')
            setPaymentStatus('error')
            return
          }

          try {
            // Confirm session with backend to create order
            const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/payment/stripe/confirm-session/${sessionId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.message || 'Failed to confirm payment session')
            }

            const responseData = await response.json()
            setPaymentData(responseData.data)
            setPaymentStatus('success')
            console.log('✅ Order created successfully via session confirmation')
          } catch (error) {
            console.error('❌ Error confirming session:', error)
            // Still show success but with warning
            setPaymentData({
              sessionId: sessionId,
              status: 'succeeded',
              message: 'Payment completed successfully (order creation may be pending)'
            })
            setPaymentStatus('success')
          }
          return
        }
        
        // If we have payment_intent, confirm with backend
        if (paymentIntentId && paymentIntentClientSecret) {
          const token = await getAuthToken()
          if (!token) {
            setError('Authentication required')
            setPaymentStatus('error')
            return
          }

          // Confirm payment with backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/payment/stripe/confirm/${paymentIntentId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to confirm payment')
          }

          const responseData = await response.json()
          setPaymentData(responseData.data)
          setPaymentStatus('success')
          return
        }
        
        // If neither session_id nor payment_intent is present
        setError('Invalid payment confirmation - missing payment parameters')
        setPaymentStatus('error')
        
      } catch (error) {
        console.error('Payment confirmation error:', error)
        setError(error.message)
        setPaymentStatus('error')
      }
    }

    handlePaymentSuccess()
  }, [searchParams])

  if (paymentStatus === 'loading') {
    return (
      <div className={successStyles.page}>
        <Navigation />
        <div className={successStyles.container}>
          <div className={successStyles.loadingContainer}>
            <div className={successStyles.loadingSpinner}>
              <div className={successStyles.spinner}></div>
            </div>
            <h2 className={successStyles.loadingTitle}>Confirming your payment...</h2>
            <p className={successStyles.loadingText}>Please wait while we verify your payment.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (paymentStatus === 'error') {
    return (
      <div className={successStyles.page}>
        <Navigation />
        <div className={successStyles.container}>
          <div className={successStyles.errorContainer}>
            <div className={successStyles.errorIcon}>
              <div className={successStyles.errorCircle}>
                <span>✕</span>
              </div>
            </div>
            <h2 className={successStyles.errorTitle}>Payment Failed</h2>
            <p className={successStyles.errorMessage}>{error}</p>
            <div className={successStyles.errorActions}>
              <button 
                className={successStyles.retryButton}
                onClick={() => window.location.href = '/checkout'}
              >
                <span>Try Again</span>
              </button>
              <button 
                className={successStyles.homeButton}
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
    <div className={successStyles.page}>
      <Navigation />
      <div className={successStyles.container}>
        <div className={successStyles.successContainer}>
          {/* Success Animation */}
          <div className={successStyles.successAnimation}>
            <div className={successStyles.checkmarkContainer}>
              <div className={successStyles.checkmark}>
                <div className={successStyles.checkmarkCircle}></div>
                <div className={successStyles.checkmarkStem}></div>
                <div className={successStyles.checkmarkKick}></div>
              </div>
            </div>
            <div className={successStyles.confetti}>
              <div className={successStyles.confettiPiece}></div>
              <div className={successStyles.confettiPiece}></div>
              <div className={successStyles.confettiPiece}></div>
              <div className={successStyles.confettiPiece}></div>
              <div className={successStyles.confettiPiece}></div>
            </div>
          </div>

          {/* Success Content */}
          <div className={successStyles.successContent}>
            <h1 className={successStyles.successTitle}>Payment Successful!</h1>
            <p className={successStyles.successMessage}>
              Thank you for your order! Your payment has been processed successfully and your order is being prepared.
            </p>
            
            {/* Payment Details Card */}
            {paymentData && (
              <div className={successStyles.paymentCard}>
                <div className={successStyles.cardHeader}>
                  <h3 className={successStyles.cardTitle}>
                    <span className={successStyles.cardIcon}>💳</span>
                    Payment Details
                  </h3>
                </div>
                <div className={successStyles.cardContent}>
                  <div className={successStyles.paymentRow}>
                    <span className={successStyles.paymentLabel}>Payment ID:</span>
                    <span className={successStyles.paymentValue}>
                      {paymentData.paymentIntentId || paymentData.sessionId}
                    </span>
                  </div>
                  {paymentData.totalAmount && (
                    <div className={successStyles.paymentRow}>
                      <span className={successStyles.paymentLabel}>Amount:</span>
                      <span className={successStyles.paymentValue}>
                        AED {paymentData.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className={successStyles.paymentRow}>
                    <span className={successStyles.paymentLabel}>Status:</span>
                    <span className={successStyles.statusBadge}>
                      {paymentData.status}
                    </span>
                  </div>
                  {paymentData.message && (
                    <div className={successStyles.paymentRow}>
                      <span className={successStyles.paymentLabel}>Message:</span>
                      <span className={successStyles.paymentValue}>
                        {paymentData.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className={successStyles.nextSteps}>
              <h4 className={successStyles.nextStepsTitle}>What's Next?</h4>
              <div className={successStyles.stepsList}>
                <div className={successStyles.step}>
                  <div className={successStyles.stepIcon}>📧</div>
                  <div className={successStyles.stepContent}>
                    <span className={successStyles.stepTitle}>Order Confirmation</span>
                    <span className={successStyles.stepDescription}>You'll receive an email confirmation shortly</span>
                  </div>
                </div>
                <div className={successStyles.step}>
                  <div className={successStyles.stepIcon}>📦</div>
                  <div className={successStyles.stepContent}>
                    <span className={successStyles.stepTitle}>Order Processing</span>
                    <span className={successStyles.stepDescription}>We're preparing your order for shipment</span>
                  </div>
                </div>
                <div className={successStyles.step}>
                  <div className={successStyles.stepIcon}>🚚</div>
                  <div className={successStyles.stepContent}>
                    <span className={successStyles.stepTitle}>Shipping Updates</span>
                    <span className={successStyles.stepDescription}>Track your order with real-time updates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={successStyles.actionButtons}>
              <button 
                className={successStyles.primaryButton}
                onClick={() => window.location.href = '/profile'}
              >
                <span className={successStyles.buttonIcon}>📋</span>
                <span>View My Orders</span>
              </button>
              <button 
                className={successStyles.secondaryButton}
                onClick={() => window.location.href = '/'}
              >
                <span className={successStyles.buttonIcon}>🛍️</span>
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
