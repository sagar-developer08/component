'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getAuthToken } from '@/utils/userUtils'
import styles from '../checkout.module.css'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState('loading')
  const [paymentData, setPaymentData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        const paymentIntentId = searchParams.get('payment_intent')
        const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret')
        
        if (!paymentIntentId || !paymentIntentClientSecret) {
          setError('Invalid payment confirmation')
          setPaymentStatus('error')
          return
        }

        const token = await getAuthToken()
        if (!token) {
          setError('Authentication required')
          setPaymentStatus('error')
          return
        }

        // Confirm payment with backend
        const response = await fetch(`https://backendcart.qliq.ae/api/payment/stripe/confirm/${paymentIntentId}`, {
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

        // Clear cart after successful payment
        // You might want to dispatch a clear cart action here
        
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
      <div className={styles.checkoutPage}>
        <Navigation />
        <div className={styles.checkoutContainer}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <h2>Confirming your payment...</h2>
            <p>Please wait while we verify your payment.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (paymentStatus === 'error') {
    return (
      <div className={styles.checkoutPage}>
        <Navigation />
        <div className={styles.checkoutContainer}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>❌</div>
            <h2>Payment Failed</h2>
            <p>{error}</p>
            <div className={styles.errorActions}>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.href = '/checkout'}
              >
                Try Again
              </button>
              <button 
                className={styles.homeButton}
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.checkoutPage}>
      <Navigation />
      <div className={styles.checkoutContainer}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✅</div>
          <h1>Payment Successful!</h1>
          <p>Thank you for your order. Your payment has been processed successfully.</p>
          
          {paymentData && (
            <div className={styles.paymentDetails}>
              <h3>Payment Details</h3>
              <div className={styles.paymentInfo}>
                <div className={styles.paymentRow}>
                  <span>Payment ID:</span>
                  <span>{paymentData.paymentIntentId}</span>
                </div>
                <div className={styles.paymentRow}>
                  <span>Amount:</span>
                  <span>AED {paymentData.totalAmount?.toFixed(2)}</span>
                </div>
                <div className={styles.paymentRow}>
                  <span>Status:</span>
                  <span className={styles.statusSuccess}>{paymentData.status}</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.successActions}>
            <button 
              className={styles.continueShoppingButton}
              onClick={() => window.location.href = '/'}
            >
              Continue Shopping
            </button>
            <button 
              className={styles.viewOrdersButton}
              onClick={() => window.location.href = '/profile'}
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
