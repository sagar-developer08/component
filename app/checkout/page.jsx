'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAuthToken, getUserFromCookies } from '@/utils/userUtils'
import { fetchCart } from '@/store/slices/cartSlice'
import { 
  fetchUserAddresses, 
  createAddress, 
  setDefaultAddress, 
  placeOrder,
  createStripePaymentIntent,
  setSelectedAddress,
  setShowAddressForm,
  updateAddressForm,
  resetAddressForm,
  setShippingSameAsDelivery,
  setShowShippingForm,
  setSelectedPaymentMethod,
  clearError,
  clearAddressError,
  clearOrderError,
  clearPaymentIntentError,
  clearStripeData
} from '@/store/slices/checkoutSlice'
import { payment as paymentEndpoints } from '@/store/api/endpoints'
import { loadStripe } from '@stripe/stripe-js'
import StripeCheckout from '@/components/StripeCheckout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBriefcase, faMapMarkerAlt, faCheck, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import styles from './checkout.module.css'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  
  // Cart state
  const { items: cartItems, total: cartTotal, loading: cartLoading } = useSelector(state => state.cart)
  
  // Checkout state
  const {
    addresses: userAddresses,
    selectedAddress,
    showAddressForm,
    loadingAddresses,
    addressError,
    addressForm,
    isSubmittingAddress,
    shippingSameAsDelivery,
    showShippingForm,
    selectedPaymentMethod,
    isPlacingOrder,
    orderError,
    stripeClientSecret,
    stripePaymentIntentId,
    isCreatingPaymentIntent,
    paymentIntentError
  } = useSelector(state => state.checkout)
  
  // Calculate total if not provided by API
  const calculatedTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const finalTotal = cartTotal || calculatedTotal
  
  // Combined error state
  const error = addressError || orderError || paymentIntentError

  // Fetch user addresses and cart on component mount
  useEffect(() => {
    const loadCheckoutData = async () => {
      // Load addresses
      dispatch(fetchUserAddresses())
      
      // Check if cart data is already available in Redux
      if (cartItems.length > 0) {
        console.log('Cart data already available in Redux:', cartItems)
        return
      }
      
      // Load cart items if not already available
      try {
        const token = await getAuthToken()
        if (token) {
          // Get userId and dispatch fetchCart with userId
          const userId = await getUserFromCookies()
          if (userId) {
            console.log('Fetching cart for userId:', userId)
            dispatch(fetchCart(userId))
          } else {
            dispatch(clearError())
            // Set error in checkout state
            dispatch(clearError())
          }
        } else {
          dispatch(clearError())
        }
      } catch (error) {
        console.error('Error loading cart:', error)
        dispatch(clearError())
      }
    }
    
    loadCheckoutData()
  }, [dispatch, cartItems.length])

  // Debug: Log cart data when it changes
  useEffect(() => {
    console.log('Checkout page cart data:', { 
      cartItems, 
      cartTotal, 
      cartLoading, 
      itemsCount: cartItems.length 
    })
    
    // Log individual cart item structure
    if (cartItems.length > 0) {
      console.log('First cart item structure:', cartItems[0])
      console.log('Cart item keys:', Object.keys(cartItems[0]))
    }
  }, [cartItems, cartTotal, cartLoading])

  // Check if cart is empty and show appropriate message
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      dispatch(clearError())
      // Set error in checkout state - we'll handle this in the UI
    } else if (cartItems.length > 0) {
      // Clear error if cart has items
      dispatch(clearError())
    }
  }, [cartItems.length, cartLoading, dispatch])

  // Auto-create Stripe payment intent when credit card is selected and we have all required data
  useEffect(() => {
    if (
      selectedPaymentMethod === 'credit-card' &&
      selectedAddress &&
      cartItems.length > 0 &&
      !stripeClientSecret &&
      !isCreatingPaymentIntent &&
      !paymentIntentError
    ) {
      handleCreateStripePaymentIntent()
    }
  }, [selectedPaymentMethod, selectedAddress, cartItems.length, stripeClientSecret, isCreatingPaymentIntent, paymentIntentError])

  // Address form handlers
  const handleAddressFormChange = (field, value) => {
    dispatch(updateAddressForm({ [field]: value }))
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    dispatch(createAddress(addressForm))
  }

  const handleSetDefaultAddress = (addressId) => {
    dispatch(setDefaultAddress(addressId))
  }

  const handleCreateStripePaymentIntent = async () => {
    if (!selectedAddress) {
      dispatch(clearPaymentIntentError())
      return
    }

    if (cartItems.length === 0) {
      dispatch(clearPaymentIntentError())
      return
    }

    const orderData = {
      items: cartItems,
      deliveryAddress: selectedAddress,
      shippingAddress: shippingSameAsDelivery ? selectedAddress : null,
      paymentMethod: selectedPaymentMethod,
      total: finalTotal,
      subtotal: finalTotal,
      vat: finalTotal * 0.05,
      shipping: 0,
      discount: 0
    }

    dispatch(createStripePaymentIntent(orderData))
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      dispatch(clearOrderError())
      return
    }

    if (cartItems.length === 0) {
      dispatch(clearOrderError())
      return
    }

        const orderData = {
          items: cartItems,
          deliveryAddress: selectedAddress,
          shippingAddress: shippingSameAsDelivery ? selectedAddress : null,
          paymentMethod: selectedPaymentMethod,
          total: finalTotal,
          subtotal: finalTotal,
          vat: finalTotal * 0.05,
          shipping: 0,
          discount: 0
        }

    dispatch(placeOrder(orderData))
  }

  const handleHostedCheckout = async () => {
    try {
      const key = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : undefined
      const publishableKey = (typeof key === 'string' && key.trim()) ? key : ''
      if (!publishableKey) {
        console.error('Stripe publishable key is missing. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
        return
      }
      const stripe = await loadStripe(publishableKey)
      if (!stripe) {
        console.error('Stripe failed to initialize')
        return
      }

      const token = await getAuthToken()
      if (!token) return

      const body = {
        items: cartItems.map(item => ({
          productId: item.productId || item.id || `product_${Math.random().toString(36).slice(2)}`,
          name: item.name || 'Product',
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: item.image || undefined
        })),
        currency: 'usd',
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout`
      }

      const res = await fetch(paymentEndpoints.stripeHostedCheckout, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }
      const { data } = await res.json()
      await stripe.redirectToCheckout({ sessionId: data.sessionId })
    } catch (e) {
      console.error('Hosted checkout error:', e)
    }
  }

  const handlePaymentSuccess = () => {
    // Clear Stripe data and redirect to success page
    dispatch(clearStripeData())
    window.location.href = '/checkout/success'
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    dispatch(clearPaymentIntentError())
  }
  return (
    <div className={styles.checkoutPage}>
      <Navigation />

      <div className={styles.checkoutContainer}>
        <h1 className={styles.checkoutTitle}>CHECKOUT</h1>
        <p className={styles.checkoutSubtitle}>
          Complete your order by selecting delivery address and payment method.
        </p>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
            {error.includes('cart is empty') && (
              <button 
                className={styles.refreshCartBtn}
                onClick={async () => {
                  try {
                    const userId = await getUserFromCookies()
                    if (userId) {
                      dispatch(fetchCart(userId))
                    }
                  } catch (error) {
                    console.error('Error refreshing cart:', error)
                  }
                }}
              >
                Refresh Cart
              </button>
            )}
          </div>
        )}
        
        {!cartLoading && cartItems.length === 0 && !error && (
          <div className={styles.errorMessage}>
            Your cart is empty. Please add items to proceed with checkout.
            <button 
              className={styles.refreshCartBtn}
              onClick={async () => {
                try {
                  const userId = await getUserFromCookies()
                  if (userId) {
                    dispatch(fetchCart(userId))
                  }
                } catch (error) {
                  console.error('Error refreshing cart:', error)
                }
              }}
            >
              Refresh Cart
            </button>
          </div>
        )}
        <div className={styles.checkoutContent}>
          {/* Left Side */}
          <div className={styles.checkoutLeft}>
            {/* Wallet Card */}
            <div className={styles.walletCard}>
              <div className={styles.walletIcon}>
                <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#0082FF" />
                  <path d="M12 16L16 20L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className={styles.walletTitle}>My Qoyns Wallet</div>
              </div>
              <div className={styles.walletInfo}>
                <div className={styles.walletBalance}>5000</div>
              </div>
              <div className={styles.walletExpiry}>Expires in 29 Days</div>
            </div>

            {/* Delivery Address */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Delivery Address</div>
              
              {loadingAddresses ? (
                <div className={styles.loadingText}>Loading addresses...</div>
              ) : userAddresses.length > 0 ? (
                <>
                  {/* Display existing addresses */}
                  <div className={styles.addressesList}>
                    {userAddresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`${styles.addressCard} ${selectedAddress?.id === address.id ? styles.selectedAddress : ''}`}
                        onClick={() => dispatch(setSelectedAddress(address))}
                        style={{ cursor: 'pointer' }}
                      >
                <div className={styles.addressType}>
                          <div className={styles.addressTypeInfo}>
                            <FontAwesomeIcon 
                              icon={
                                address.type === 'home' ? faHome : 
                                address.type === 'work' ? faBriefcase : 
                                faMapMarkerAlt
                              } 
                              className={styles.addressTypeIcon}
                            />
                            <span className={styles.addressLabel}>{address.type}</span>
                            {address.isDefault && (
                              <span className={styles.defaultBadge}>Default</span>
                            )}
                          </div>
                          {selectedAddress?.id === address.id && (
                            <div className={styles.selectedIndicator}>
                              <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                            </div>
                          )}
                </div>
                <div className={styles.addressDetails}>
                  <div className={styles.addressText}>
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </div>
                          <div className={styles.addressLocation}>
                            {address.city}, {address.state} {address.postalCode}
                          </div>
                          <div className={styles.addressContact}>{address.phone}</div>
                          <div className={styles.addressContact}>{address.email}</div>
                        </div>
                        {!address.isDefault && (
                          <button 
                            className={styles.setDefaultBtn}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSetDefaultAddress(address.id)
                            }}
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    className={styles.addAddressBtn}
                    onClick={() => dispatch(setShowAddressForm(!showAddressForm))}
                  >
                    <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
                    Add New Address
                  </button>
                </>
              ) : (
                <div className={styles.noAddresses}>
                  <p>No addresses found. Please add an address to continue.</p>
                  <button 
                    className={styles.addAddressBtn}
                    onClick={() => dispatch(setShowAddressForm(true))}
                  >
                    <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
                    Add Address
                  </button>
                </div>
              )}

              {/* Address Form */}
              {showAddressForm && (
                <form className={styles.addressForm} onSubmit={handleAddressSubmit}>
                  {error && (
                    <div className={styles.errorMessage}>
                      {error}
                    </div>
                  )}
                <div className={styles.addressFormTabs}>
                    <button 
                      type="button"
                      className={`${styles.addressTab} ${addressForm.type === 'home' ? styles.active : ''}`}
                      onClick={() => handleAddressFormChange('type', 'home')}
                      title="Home"
                    >
                      <FontAwesomeIcon 
                        icon={faHome} 
                        className={styles.addressTabIcon}
                        style={{ color: addressForm.type === 'home' ? '#0082FF' : '#E5E5E5' }}
                      />
                    </button>
                    <button 
                      type="button"
                      className={`${styles.addressTab} ${addressForm.type === 'work' ? styles.active : ''}`}
                      onClick={() => handleAddressFormChange('type', 'work')}
                      title="Work"
                    >
                      <FontAwesomeIcon 
                        icon={faBriefcase} 
                        className={styles.addressTabIcon}
                        style={{ color: addressForm.type === 'work' ? '#0082FF' : '#E5E5E5' }}
                      />
                    </button>
                    <button 
                      type="button"
                      className={`${styles.addressTab} ${addressForm.type === 'other' ? styles.active : ''}`}
                      onClick={() => handleAddressFormChange('type', 'other')}
                      title="Other"
                    >
                      <FontAwesomeIcon 
                        icon={faMapMarkerAlt} 
                        className={styles.addressTabIcon}
                        style={{ color: addressForm.type === 'other' ? '#0082FF' : '#E5E5E5' }}
                      />
                    </button>
                    <input 
                      className={styles.addressLabelInput} 
                      placeholder="Custom Label" 
                      value={addressForm.type}
                      onChange={(e) => handleAddressFormChange('type', e.target.value)}
                    />
                </div>
                <div className={styles.addressFormGrid}>
                    <input 
                      className={styles.addressInput} 
                      placeholder="Full Name"
                      value={addressForm.fullName}
                      onChange={(e) => handleAddressFormChange('fullName', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Phone"
                      value={addressForm.phone}
                      onChange={(e) => handleAddressFormChange('phone', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Email"
                      type="email"
                      value={addressForm.email}
                      onChange={(e) => handleAddressFormChange('email', e.target.value)}
                      required
                    />
                    <select 
                      className={styles.addressInput}
                      value={addressForm.country}
                      onChange={(e) => handleAddressFormChange('country', e.target.value)}
                      required
                    >
                      <option value="">Country</option>
                      <option value="AE">UAE</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="KW">Kuwait</option>
                      <option value="QA">Qatar</option>
                    </select>
                    <select 
                      className={styles.addressInput}
                      value={addressForm.state}
                      onChange={(e) => handleAddressFormChange('state', e.target.value)}
                      required
                    >
                      <option value="">State</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                    </select>
                    <input 
                      className={styles.addressInput} 
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => handleAddressFormChange('city', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Postal Code"
                      value={addressForm.postalCode}
                      onChange={(e) => handleAddressFormChange('postalCode', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Address Line 1"
                      value={addressForm.addressLine1}
                      onChange={(e) => handleAddressFormChange('addressLine1', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Address Line 2"
                      value={addressForm.addressLine2}
                      onChange={(e) => handleAddressFormChange('addressLine2', e.target.value)}
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Landmark"
                      value={addressForm.landmark}
                      onChange={(e) => handleAddressFormChange('landmark', e.target.value)}
                    />
                    <textarea 
                      className={styles.addressInput} 
                      placeholder="Delivery Instructions"
                      value={addressForm.instructions}
                      onChange={(e) => handleAddressFormChange('instructions', e.target.value)}
                      rows="3"
                    />
                </div>
                <div className={styles.addressFormActions}>
                    <button 
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => dispatch(setShowAddressForm(false))}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className={styles.saveBtn}
                      disabled={isSubmittingAddress}
                    >
                      {isSubmittingAddress ? 'Saving...' : 'Save'}
                    </button>
                </div>
                </form>
              )}
            </div>

            {/* Shipping Address */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Shipping Address</div>
              <div className={styles.shippingTabs}>
                <button 
                  className={shippingSameAsDelivery ? styles.shippingTab1 : styles.shippingTab}
                  onClick={() => {
                    dispatch(setShippingSameAsDelivery(true))
                    dispatch(setShowShippingForm(false))
                  }}
                >
                  Same as Delivery Address
                </button>
                <button 
                  className={!shippingSameAsDelivery ? styles.shippingTab1 : styles.shippingTab}
                  onClick={() => {
                    dispatch(setShippingSameAsDelivery(false))
                    dispatch(setShowShippingForm(true))
                  }}
                >
                  Use a Different Address
                </button>
              </div>
              
              {/* Show message when same as delivery address is selected */}
              {shippingSameAsDelivery && selectedAddress && (
                <div className={styles.sameAsDeliveryMessage}>
                  <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                  <span>Using the same address as delivery address</span>
                </div>
              )}

              {/* Shipping Address Form - Only show if different address is selected */}
              {!shippingSameAsDelivery && showShippingForm && (
                <form className={styles.addressForm} onSubmit={handleAddressSubmit}>
                <div className={styles.addressFormTabs}>
                    <button 
                      type="button"
                      className={`${styles.addressTab} ${addressForm.type === 'home' ? styles.active : ''}`}
                      onClick={() => handleAddressFormChange('type', 'home')}
                      title="Home"
                    >
                      <FontAwesomeIcon 
                        icon={faHome} 
                        className={styles.addressTabIcon}
                        style={{ color: addressForm.type === 'home' ? '#0082FF' : '#E5E5E5' }}
                      />
                    </button>
                    <button 
                      type="button"
                      className={`${styles.addressTab} ${addressForm.type === 'work' ? styles.active : ''}`}
                      onClick={() => handleAddressFormChange('type', 'work')}
                      title="Work"
                    >
                      <FontAwesomeIcon 
                        icon={faBriefcase} 
                        className={styles.addressTabIcon}
                        style={{ color: addressForm.type === 'work' ? '#0082FF' : '#E5E5E5' }}
                      />
                    </button>
                    <button 
                      type="button"
                      className={`${styles.addressTab} ${addressForm.type === 'other' ? styles.active : ''}`}
                      onClick={() => handleAddressFormChange('type', 'other')}
                      title="Other"
                    >
                      <FontAwesomeIcon 
                        icon={faMapMarkerAlt} 
                        className={styles.addressTabIcon}
                        style={{ color: addressForm.type === 'other' ? '#0082FF' : '#E5E5E5' }}
                      />
                    </button>
                    <input 
                      className={styles.addressLabelInput} 
                      placeholder="Custom Label" 
                      value={addressForm.type}
                      onChange={(e) => handleAddressFormChange('type', e.target.value)}
                    />
                </div>
                <div className={styles.addressFormGrid}>
                    <input 
                      className={styles.addressInput} 
                      placeholder="Full Name"
                      value={addressForm.fullName}
                      onChange={(e) => handleAddressFormChange('fullName', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Phone"
                      value={addressForm.phone}
                      onChange={(e) => handleAddressFormChange('phone', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Email"
                      type="email"
                      value={addressForm.email}
                      onChange={(e) => handleAddressFormChange('email', e.target.value)}
                      required
                    />
                    <select 
                      className={styles.addressInput}
                      value={addressForm.country}
                      onChange={(e) => handleAddressFormChange('country', e.target.value)}
                      required
                    >
                      <option value="">Country</option>
                      <option value="AE">UAE</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="KW">Kuwait</option>
                      <option value="QA">Qatar</option>
                    </select>
                    <select 
                      className={styles.addressInput}
                      value={addressForm.state}
                      onChange={(e) => handleAddressFormChange('state', e.target.value)}
                      required
                    >
                      <option value="">State</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                    </select>
                    <input 
                      className={styles.addressInput} 
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => handleAddressFormChange('city', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Postal Code"
                      value={addressForm.postalCode}
                      onChange={(e) => handleAddressFormChange('postalCode', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Address Line 1"
                      value={addressForm.addressLine1}
                      onChange={(e) => handleAddressFormChange('addressLine1', e.target.value)}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Address Line 2"
                      value={addressForm.addressLine2}
                      onChange={(e) => handleAddressFormChange('addressLine2', e.target.value)}
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Landmark"
                      value={addressForm.landmark}
                      onChange={(e) => handleAddressFormChange('landmark', e.target.value)}
                    />
                    <textarea 
                      className={styles.addressInput} 
                      placeholder="Delivery Instructions"
                      value={addressForm.instructions}
                      onChange={(e) => handleAddressFormChange('instructions', e.target.value)}
                      rows="3"
                    />
                </div>
                <div className={styles.addressFormActions}>
                    <button 
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => {
                        dispatch(setShowShippingForm(false))
                        dispatch(setShippingSameAsDelivery(true))
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn}>Save</button>
                </div>
                </form>
              )}
            </div>

            {/* Shipping Method */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Shipping Method</div>
              <div className={styles.shippingMethodCard}>
                <span>Standard</span>
                <span className={styles.shippingTime}>3 - 5 Days</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Payment Method</div>
              <div className={styles.paymentMethods}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={selectedPaymentMethod === 'credit-card'}
                    onChange={(e) => {
                      dispatch(setSelectedPaymentMethod(e.target.value))
                      dispatch(clearStripeData()) // Clear previous Stripe data when switching
                    }}
                    className={styles.paymentRadio}
                  />
                  <div className={styles.paymentContent}>
                    <div className={styles.paymentText}>Credit/Debit</div>
                  </div>
                </label>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="tabby"
                    checked={selectedPaymentMethod === 'tabby'}
                    onChange={(e) => {
                      dispatch(setSelectedPaymentMethod(e.target.value))
                      dispatch(clearStripeData()) // Clear Stripe data when switching to other methods
                    }}
                    className={styles.paymentRadio}
                  />
                  <div className={styles.paymentContent}>
                    <div className={styles.paymentText}>
                      Pay With <span className={styles.paymentBadgeTabby}>tabby</span>
                    </div>
                  </div>
                </label>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="tamara"
                    checked={selectedPaymentMethod === 'tamara'}
                    onChange={(e) => {
                      dispatch(setSelectedPaymentMethod(e.target.value))
                      dispatch(clearStripeData()) // Clear Stripe data when switching to other methods
                    }}
                    className={styles.paymentRadio}
                  />
                  <div className={styles.paymentContent}>
                    <div className={styles.paymentText}>
                      Pay With <span className={styles.paymentBadgeTamara}>tamara</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Stripe Hosted Checkout Button */}
              {selectedPaymentMethod === 'credit-card' && (
                <div className={styles.stripePaymentSection}>
                  <button 
                    className={styles.placeOrderBtn}
                    onClick={handleHostedCheckout}
                    disabled={cartItems.length === 0 || !selectedAddress}
                  >
                    Pay with Card (Stripe Checkout)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className={styles.checkoutRight}>
            <div className={styles.orderSummary}>
              {cartLoading ? (
                <div className={styles.loadingText}>Loading cart items...</div>
              ) : cartItems.length > 0 ? (
                <>
                  {cartItems.map((item, index) => (
                    <div key={index} className={styles.productItem}>
                <Image
                        src="/iphone.jpg"
                        alt={item.name || "Product"}
                  width={60}
                  height={60}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                        <div className={styles.productBrand}>{item.brand || "Brand"}</div>
                        <div className={styles.productName}>{item.name || "Product Name"}</div>
                        <div className={styles.productQuantity}>Qty: {item.quantity}</div>
                      </div>
                      <div className={styles.productPrice}>AED {item.price || 0}</div>
                    </div>
                  ))}
                </>
              ) : (
                <div className={styles.emptyCart}>
                  <p>Your cart is empty</p>
                  <p>Add items to proceed with checkout</p>
                </div>
              )}
              {/* Qoyns Slider */}
              <div className={styles.qoynsSliderSection}>
                <div className={styles.qoynsSliderLabel}>Choose Qoyns to use</div>
                <div className={styles.qoynsSliderTrack}>
                  <input type="range" min="10" max="50" step="10" className={styles.qoynsSlider} />
                  <div className={styles.qoynsSliderTicks}>
                    <span>10%</span>
                    <span>20%</span>
                    <span>30%</span>
                    <span>40%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
              {/* Promo Code */}
              <div className={styles.promoCode}>
                <input className={styles.promoInput} value="" placeholder='OFF500' readOnly />
                <button className={styles.promoApplyBtn}>Apply</button>
              </div>
              {/* Totals */}
              {cartItems.length > 0 && (
              <div className={styles.orderTotals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                    <span>AED {finalTotal.toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className={styles.totalRow}>
                  <span>VAT</span>
                    <span>AED {(finalTotal * 0.05).toFixed(2)}</span>
                </div>
                <div className={styles.totalRowDiscount}>
                  <span>Discount</span>
                    <span>- AED 0.00</span>
                </div>
                <div className={styles.totalRowFinal}>
                  <span>Order Total</span>
                    <span>AED {(finalTotal * 1.05).toFixed(2)}</span>
                  </div>
                </div>
              )}
              {selectedPaymentMethod === 'credit-card' ? (
                // For Stripe, the payment button is in the Stripe Elements component
                <div className={styles.stripeNote}>
                  Complete payment using the form above
                </div>
              ) : (
                <button 
                  className={styles.placeOrderBtn}
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || cartItems.length === 0}
                >
                  {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}