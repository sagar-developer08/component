'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getAuthToken, getUserFromCookies } from '@/utils/userUtils'
import styles from '../checkout.module.css'
import successStyles from './success.module.css'
import { removeFromCart, clearCart } from '@/store/slices/cartSlice'
import { redeemQoyns } from '@/store/slices/checkoutSlice'
import { fetchUserBalance } from '@/store/slices/walletSlice'
import { orders } from '@/store/api/endpoints'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items || [])
  const [paymentStatus, setPaymentStatus] = useState('loading')
  const [paymentData, setPaymentData] = useState(null)
  const [error, setError] = useState(null)

  // Function to fetch the latest order and redeem Qoyns (with retry logic)
  const fetchOrderAndRedeemQoyns = async (sessionIdOrPaymentIntentId, type, retryCount = 0) => {
    const MAX_RETRIES = 3
    const RETRY_DELAY = 2000 // 2 seconds
    
    try {
      console.log(`🔍 [QOYNS REDEMPTION] Attempt ${retryCount + 1}/${MAX_RETRIES + 1} - Fetching order after payment confirmation...`)
      console.log('🔍 [QOYNS REDEMPTION] Session/Payment Intent ID:', sessionIdOrPaymentIntentId, 'Type:', type)
      
      // Check if there are pending Qoyns to redeem
      const pendingRedemption = sessionStorage.getItem('pendingQoynRedemption')
      if (!pendingRedemption) {
        console.log('⚠️ [QOYNS REDEMPTION] No pending Qoyn redemption found in sessionStorage')
        return
      }

      console.log('✅ [QOYNS REDEMPTION] Found pending redemption')
      const redemptionInfo = JSON.parse(pendingRedemption)
      console.log('✅ [QOYNS REDEMPTION] Parsed redemption info:', redemptionInfo)
      
      // Fetch the latest order for the user
      const token = await getAuthToken()
      if (!token) {
        console.error('❌ [QOYNS REDEMPTION] No auth token available')
        return
      }

      console.log('📡 [QOYNS REDEMPTION] Fetching user orders...')
      const ordersResponse = await fetch(`${orders.getUserOrders}?page=1&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!ordersResponse.ok) {
        const errorText = await ordersResponse.text()
        console.error('❌ [QOYNS REDEMPTION] Failed to fetch orders:', ordersResponse.status, errorText)
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            fetchOrderAndRedeemQoyns(sessionIdOrPaymentIntentId, type, retryCount + 1)
          }, RETRY_DELAY)
        }
        return
      }

      const ordersData = await ordersResponse.json()
      console.log('📦 [QOYNS REDEMPTION] Orders response structure:', {
        hasData: !!ordersData.data,
        hasOrders: !!ordersData.orders,
        keys: Object.keys(ordersData)
      })
      
      // Get the latest order - handle different response structures
      const ordersList = ordersData?.data?.orders || 
                        ordersData?.orders?.orders || 
                        ordersData?.data || 
                        ordersData?.orders ||
                        []
      
      console.log('📦 [QOYNS REDEMPTION] Orders list length:', ordersList.length)
      
      if (!ordersList || ordersList.length === 0) {
        console.warn(`⚠️ [QOYNS REDEMPTION] No orders found (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)
        if (retryCount < MAX_RETRIES) {
          console.log(`🔄 [QOYNS REDEMPTION] Retrying in ${RETRY_DELAY}ms...`)
          setTimeout(() => {
            fetchOrderAndRedeemQoyns(sessionIdOrPaymentIntentId, type, retryCount + 1)
          }, RETRY_DELAY)
        } else {
          console.error('❌ [QOYNS REDEMPTION] Max retries reached. Full response:', ordersData)
        }
        return
      }
      
      // Get the most recent order (first one, as they're sorted by createdAt descending)
      const latestOrder = ordersList[0]

      console.log('✅ [QOYNS REDEMPTION] Found latest order:', {
        orderNumber: latestOrder.orderNumber,
        orderId: latestOrder.orderId,
        _id: latestOrder._id,
        id: latestOrder.id,
        createdAt: latestOrder.createdAt
      })
      
      // Get order ID - try multiple fields (orderNumber is the primary identifier)
      const orderId = latestOrder.orderNumber || latestOrder.orderId || latestOrder._id || latestOrder.id
      
      if (!orderId) {
        console.error('❌ [QOYNS REDEMPTION] Order ID not found in order data. Order keys:', Object.keys(latestOrder))
        console.error('❌ [QOYNS REDEMPTION] Full order data:', latestOrder)
        return
      }

      console.log('🚀 [QOYNS REDEMPTION] Calling redemption API with:', {
        orderId,
        totalAmount: redemptionInfo.totalAmount,
        metadata: {
          storeId: redemptionInfo.storeId || undefined,
          productIds: redemptionInfo.productIds || []
        }
      })
      
      // Redeem Qoyns with actual order ID
      const result = await dispatch(redeemQoyns({
        orderId: orderId,
        totalAmount: redemptionInfo.totalAmount,
        metadata: {
          storeId: redemptionInfo.storeId || undefined,
          productIds: redemptionInfo.productIds || []
        }
      }))

      console.log('📥 [QOYNS REDEMPTION] Redemption result:', {
        type: result.type,
        error: result.error,
        payload: result.payload
      })

      if (redeemQoyns.fulfilled.match(result)) {
        console.log('✅ [QOYNS REDEMPTION] Qoyns redeemed successfully!')
        console.log('📊 [QOYNS REDEMPTION] Result payload:', result.payload)
        // Clear sessionStorage
        sessionStorage.removeItem('pendingQoynRedemption')
        console.log('🗑️ [QOYNS REDEMPTION] Cleared sessionStorage')
        // Refresh wallet balance
        dispatch(fetchUserBalance())
        console.log('🔄 [QOYNS REDEMPTION] Refreshed wallet balance')
      } else {
        console.error('❌ [QOYNS REDEMPTION] Failed to redeem Qoyns')
        console.error('❌ [QOYNS REDEMPTION] Error:', result.error)
        console.error('❌ [QOYNS REDEMPTION] Payload:', result.payload)
      }
    } catch (error) {
      console.error('❌ [QOYNS REDEMPTION] Exception occurred:', error)
      console.error('❌ [QOYNS REDEMPTION] Error stack:', error.stack)
      // Don't fail the entire success page if redemption fails
    }
  }

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
            
            // Immediately fetch the order and redeem Qoyns (order should be created synchronously)
            await fetchOrderAndRedeemQoyns(sessionId, 'session')
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
          
          // Immediately fetch the order and redeem Qoyns
          await fetchOrderAndRedeemQoyns(paymentIntentId, 'paymentIntent')
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

  // After success, clear cart state immediately to prevent repeated updates
  useEffect(() => {
    if (paymentStatus !== 'success') return
    
    // Clear cart immediately to prevent state update loops
    dispatch(clearCart())
    
    // Optionally remove items from server-side cart (but don't wait for it)
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      (async () => {
        try {
          const userId = await getUserFromCookies()
          if (userId) {
            // Remove items from server without waiting for completion
            cartItems.forEach(item => {
              dispatch(removeFromCart({ userId, productId: item.productId || item.id })).catch(() => {})
            })
          }
        } catch (e) {
          // ignore server-side cleanup errors
        }
      })()
    }
  }, [paymentStatus, dispatch])

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
                onClick={() => window.location.href = '/profile?tab=orders'}
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
