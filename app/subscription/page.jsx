'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubscriptionDetails, createWebSubscription, clearWebSubscriptionError } from '@/store/slices/subscriptionSlice'
import { useToast } from '@/contexts/ToastContext'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import styles from './subscription.module.css'

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('plus')
  const dispatch = useDispatch()
  const { show: showToast } = useToast()
  const { 
    subscriptionDetails, 
    loading, 
    error,
    webSubscriptionLoading,
    webSubscriptionError,
    checkoutUrl
  } = useSelector(state => state.subscription)

  // Fetch subscription details when page loads
  useEffect(() => {
    dispatch(fetchSubscriptionDetails())
  }, [dispatch])

  // Show toast notifications for errors
  useEffect(() => {
    if (error) {
      showToast(`Error loading subscription details: ${error}`, 'error')
    }
  }, [error, showToast])

  useEffect(() => {
    if (webSubscriptionError) {
      showToast(`Error creating subscription: ${webSubscriptionError}`, 'error')
    }
  }, [webSubscriptionError, showToast])

  const handleUpgrade = async (plan) => {
    try {
      // Clear any previous errors
      dispatch(clearWebSubscriptionError())
      
      // Create subscription data based on the plan
      const subscriptionData = {
        amount: 100, // Default amount for plus plan
        tier: plan
      }
      
      // Dispatch the create web subscription action
      const result = await dispatch(createWebSubscription(subscriptionData))
      
      if (createWebSubscription.fulfilled.match(result)) {
        // If successful, redirect to Stripe checkout
        if (result.payload.checkoutUrl) {
          showToast('Redirecting to checkout...', 'success')
          
          // Store the subscription data in sessionStorage for the success page
          sessionStorage.setItem('subscriptionData', JSON.stringify({
            amount: subscriptionData.amount,
            tier: subscriptionData.tier,
            subscription: result.payload.subscription
          }))
          
          // Redirect to Stripe checkout
          window.location.href = result.payload.checkoutUrl
        }
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      showToast('Failed to create subscription. Please try again.', 'error')
    }
  }

  // Helper function to get plan data by tier name
  const getPlanData = (tierName) => {
    return subscriptionDetails.find(plan => 
      plan.tier.toLowerCase() === tierName.toLowerCase()
    )
  }

  // Helper function to get tier color
  const getTierColor = (tierName) => {
    switch (tierName.toLowerCase()) {
      case 'plus':
        return '#0082FF'
      case 'silver':
        return '#C5C5C5'
      case 'gold':
        return '#FFD700'
      default:
        return '#0082FF'
    }
  }

  return (
    <div className={styles.subscriptionPage}>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>Upgrade Account</h1>
            {/* <p className={styles.subtitle}>
              Choose the perfect plan for your needs and unlock exclusive QLIQ Plus benefits.
            </p> */}
          </div>
        </div>
        
        <div className={styles.subscriptionContent}>
          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
              </div>
              <p>Loading subscription details...</p>
            </div>
          )}
          
          
          {!loading && !error && subscriptionDetails.length > 0 && (
            <div className={styles.subscriptionPlans}>
              {subscriptionDetails.map((plan) => {
                const tierName = plan.tier.toLowerCase()
                const tierColor = getTierColor(tierName)
                const isSelected = selectedPlan === tierName
                const canUpgrade = plan.upgrade
                const userAlreadyHas = plan.userAlreadyHas
                
                return (
                  <div 
                    key={plan.tier}
                    className={`${styles.subscriptionPlan} ${tierName} ${isSelected ? 'selected' : ''}` } 
                    style={{ borderColor: tierColor }}
                  >
                    <div className={styles.planHeader}>
                      <h3 className={`${styles.planName} ${tierName}`} style={{ color: tierColor }}>{plan.tier}</h3>
                      <div className={styles.planPrice}>${plan.price}</div>
                      <div className={styles.planBilling}>per user/year</div>
                      {plan.userLimit > 0 && (
                        <div className={styles.planLimit}>User Limit: {plan.userLimit}</div>
                      )}
                      {userAlreadyHas && (
                        <div className={styles.currentPlanBadge}>Current Plan</div>
                      )}
                    </div>
                    
                    <div className={styles.planFeatures}>
                      <h4 className={styles.featuresTitle}>Features</h4>
                      <ul className={styles.featuresList}>
                        {plan.benefits.map((benefit, index) => (
                          <li key={index} className={styles.featureItem}>
                            <svg className={`${styles.checkmark} ${tierName}`} width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <circle cx="10" cy="10" r="10" fill={tierColor} />
                              <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button 
                      className={`${styles.upgradeBtn} ${tierName} ${!canUpgrade ? 'disabled' : ''}`}
                      onClick={() => handleUpgrade(tierName)}
                      disabled={!canUpgrade || userAlreadyHas || webSubscriptionLoading}
                      style={{ backgroundColor: tierColor }}
                    >
                      {userAlreadyHas ? 'Current Plan' : 
                       webSubscriptionLoading ? 'Processing...' :
                       canUpgrade ? 'Upgrade Now' : 'Not Available'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
