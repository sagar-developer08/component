'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAuthToken, getUserFromCookies, getUserIds } from '@/utils/userUtils'
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
  clearStripeData,
  validateQoynRedemption,
  fetchAcceptedPurchaseGigs,
  setAppliedCoupon,
  clearAppliedCoupon
} from '@/store/slices/checkoutSlice'
import { fetchProfile } from '@/store/slices/profileSlice'
import { fetchUserBalance } from '@/store/slices/walletSlice'
import { payment as paymentEndpoints } from '@/store/api/endpoints'
import { loadStripe } from '@stripe/stripe-js'
import StripeCheckout from '@/components/StripeCheckout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBriefcase, faMapMarkerAlt, faCheck, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '@/contexts/ToastContext'
import styles from './checkout.module.css'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const { show: showToast } = useToast()

  // State to control address display
  const [showAllAddresses, setShowAllAddresses] = useState(false)
  
  // Promo code input state
  const [promoCodeInput, setPromoCodeInput] = useState('')
  
  // State to track address validation error
  const [addressValidationError, setAddressValidationError] = useState(false)
  
  // Ref for address section to scroll to
  const addressSectionRef = useRef(null)
  
  // Applied discount state
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  
  // Selected coupon state
  const [selectedCouponId, setSelectedCouponId] = useState('')

  // Cart state
  const { items: cartItems, total: cartTotal, loading: cartLoading } = useSelector(state => state.cart)

  // Profile state - for user data
  const { user, addresses: profileAddresses } = useSelector(state => state.profile)
  
  // Wallet state
  const { userQoynBalance, userBalance, storeCurrency, loading: walletLoading } = useSelector(state => state.wallet)

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
    paymentIntentError,
    qoynValidation,
    coupons,
    loadingCoupons,
    couponsError,
    appliedCoupon
  } = useSelector(state => state.checkout)

  // Combine addresses from both sources to ensure we get all available addresses
  const allAddresses = []

  // Add addresses from checkout slice
  if (userAddresses && userAddresses.length > 0) {
    allAddresses.push(...userAddresses)
  }

  // Add addresses from profile slice that aren't already included
  if (profileAddresses && profileAddresses.length > 0) {
    profileAddresses.forEach(profileAddr => {
      const exists = allAddresses.some(addr =>
        (addr.id || addr._id) === (profileAddr.id || profileAddr._id)
      )
      if (!exists) {
        allAddresses.push(profileAddr)
      }
    })
  }

  // Show only first 2 addresses initially, or all if showAllAddresses is true
  const displayAddresses = showAllAddresses ? allAddresses : allAddresses.slice(0, 2)

  // Calculate total if not provided by API
  const calculatedTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const originalSubtotal = cartTotal || calculatedTotal

  // Helper function to extract pid from productUrl
  const extractPidFromUrl = (productUrl) => {
    if (!productUrl) return null
    try {
      const url = new URL(productUrl)
      const pid = url.searchParams.get('pid')
      return pid ? String(pid).trim() : null
    } catch (error) {
      // If URL parsing fails, try regex extraction
      const match = productUrl.match(/[?&]pid=([^&]+)/)
      return match ? String(match[1]).trim() : null
    }
  }

  // Filter coupons that match cart items by productId - ONLY show matching ones
  // Compare: cart item productId with coupon pid (extracted from productUrl)
  const availableCoupons = coupons.filter(coupon => {
    // Extract pid from productUrl
    const couponPid = coupon.pid || extractPidFromUrl(coupon.productUrl)
    
    if (!couponPid) {
      console.log('Coupon missing pid:', coupon)
      return false
    }
    
    return cartItems.some(item => {
      // Get productId from cart item (from data.cart.items[].productId)
      const itemProductId = String(item.productId || item.id || '').trim()
      // Get pid from coupon (from productUrl query parameter or direct pid field)
      const pid = String(couponPid).trim()
      
      // Exact string comparison (case-sensitive)
      const isMatch = itemProductId === pid && itemProductId !== '' && pid !== ''
      
      // Debug logging for all comparisons
      console.log('🔍 Comparing:', {
        couponCode: coupon.discountCode,
        couponPid: pid,
        itemProductId: itemProductId,
        isMatch: isMatch,
        matchType: isMatch ? '✅ MATCH' : '❌ NO MATCH',
        itemName: item.name || 'N/A',
        productUrl: coupon.productUrl || 'N/A'
      })
      
      return isMatch
    })
  })
  
  // Debug: Log available coupons
  useEffect(() => {
    if (coupons.length > 0) {
      console.log('📦 === Coupon Matching Debug ===')
      console.log('🎫 All coupons from API:', coupons.map(c => {
        const pid = c.pid || extractPidFromUrl(c.productUrl)
        return {
          _id: c._id,
          discountCode: c.discountCode,
          pid: pid,
          productUrl: c.productUrl,
          percentage: c.customerDiscountPercentage
        }
      }))
      console.log('🛒 Cart items:', cartItems.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        quantity: item.quantity
      })))
      console.log('✅ Available coupons (matched):', availableCoupons.map(c => {
        const pid = c.pid || extractPidFromUrl(c.productUrl)
        return {
          discountCode: c.discountCode,
          pid: pid
        }
      }))
      console.log('📊 Match count:', availableCoupons.length, 'out of', coupons.length)
      console.log('===============================')
    }
  }, [coupons, cartItems, availableCoupons])

  // Apply coupon discount to subtotal if coupon is applied
  let couponDiscountAmount = 0
  let subtotal = originalSubtotal
  if (appliedCoupon && appliedCoupon.customerDiscountPercentage) {
    const discountPercentage = appliedCoupon.customerDiscountPercentage
    // Calculate discount amount based on percentage
    couponDiscountAmount = (originalSubtotal * discountPercentage) / 100
    // Apply discount to subtotal
    subtotal = originalSubtotal - couponDiscountAmount
  }

  // VAT Calculation - use product VAT percentage or default to 5%
  const getVatRate = () => {
    if (cartItems.length === 0) return 0.05; // Default 5%
    
    // Get VAT percentage from the first item (assuming all items have same VAT rate)
    const firstItem = cartItems[0];
    const vatPercentage = firstItem.vat_percentage || 5; // Default to 5% if not provided
    return vatPercentage / 100; // Convert percentage to decimal
  }
  
  const vatRate = getVatRate();
  const vatAmount = subtotal * vatRate;
  const finalTotal = subtotal + vatAmount;
  
  // Calculate the actual total to be charged (after discounts)
  const getActualTotal = () => {
    if (appliedDiscount) {
      return appliedDiscount.totalAfterDiscount;
    }
    return finalTotal;
  };
  
  const actualTotal = getActualTotal();

  // Combined error state
  const error = addressError || orderError || paymentIntentError

  // Fetch user addresses and cart on component mount
  useEffect(() => {
    const loadCheckoutData = async () => {
      // Load profile data for user info (name, email, phone)
      dispatch(fetchProfile())
      
      // Load wallet balance
      dispatch(fetchUserBalance())

      // Load addresses
      dispatch(fetchUserAddresses())
      
      // Load coupons
      dispatch(fetchAcceptedPurchaseGigs())

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
          try {
            const userId = await getUserFromCookies()
            if (userId) {
              console.log('Fetching cart for userId:', userId)
              dispatch(fetchCart(userId))
            } else {
              dispatch(clearError())
            }
          } catch (error) {
            console.log('No user found in cookies')
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

  // Auto-validate Qoyn redemption when cart total changes
  useEffect(() => {
    if (finalTotal > 0 && cartItems.length > 0) {
      // Auto-validate with cart total amount
      dispatch(validateQoynRedemption({
        totalAmount: finalTotal
      }))
    }
  }, [finalTotal, cartItems.length, dispatch])

  // Auto-populate address form with user data when form is shown
  useEffect(() => {
    if (showAddressForm && user) {
      dispatch(updateAddressForm({
        fullName: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }))
    }
  }, [showAddressForm, user, dispatch])

  // Ensure a selected address when addresses are available (prefer default)
  useEffect(() => {
    if (!selectedAddress && displayAddresses.length > 0) {
      const defaultAddr = displayAddresses.find(a => a.isDefault)
      dispatch(setSelectedAddress(defaultAddr || displayAddresses[0]))
    }
  }, [displayAddresses, selectedAddress, dispatch])
  
  // Clear validation error when address is selected
  useEffect(() => {
    if (selectedAddress && addressValidationError) {
      setAddressValidationError(false)
    }
  }, [selectedAddress, addressValidationError])

  // Set Stripe as default payment method
  useEffect(() => {
    if (!selectedPaymentMethod) {
      dispatch(setSelectedPaymentMethod('credit-card'))
    }
  }, [selectedPaymentMethod, dispatch])

  // Debug: Log cart data when it changes (commented out to prevent console spam)
  // useEffect(() => {
  //   console.log('Checkout page cart data:', { 
  //     cartItems, 
  //     cartTotal, 
  //     cartLoading, 
  //     itemsCount: cartItems.length 
  //   })
  //   
  //   // Log individual cart item structure
  //   if (cartItems.length > 0) {
  //     console.log('First cart item structure:', cartItems[0])
  //     console.log('Cart item keys:', Object.keys(cartItems[0]))
  //   }
  // }, [cartItems, cartTotal, cartLoading])

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
    const result = await dispatch(createAddress(addressForm))

    // Refetch addresses to ensure we have the latest data
    if (createAddress.fulfilled.match(result)) {
      await dispatch(fetchUserAddresses())
    }
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
      total: actualTotal,
      subtotal: subtotal,
      vat: vatAmount,
      shipping: 0,
      discount: appliedDiscount ? appliedDiscount.discountAmount : couponDiscountAmount,
      couponCode: appliedCoupon ? appliedCoupon.discountCode : null
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
      total: actualTotal,
      subtotal: subtotal,
      vat: vatAmount,
      shipping: 0,
      discount: appliedDiscount ? appliedDiscount.discountAmount : couponDiscountAmount,
      couponCode: appliedCoupon ? appliedCoupon.discountCode : null
    }

    dispatch(placeOrder(orderData))
  }

  const handleHostedCheckout = async () => {
    try {
      console.log('🚀 Checkout button clicked!')
      console.log('📦 Cart items:', cartItems)
      console.log('📍 Selected address:', selectedAddress)

      // Validation checks
      if (cartItems.length === 0) {
        showToast('Your cart is empty. Please add items before checkout.', 'error')
        return
      }

      if (!selectedAddress) {
        setAddressValidationError(true)
        showToast('Add a address first', 'error')
        // Scroll to address section
        setTimeout(() => {
          if (addressSectionRef.current) {
            addressSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
        return
      }
      
      // Clear validation error if address is selected
      setAddressValidationError(false)

      const key = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : undefined
      const publishableKey = (typeof key === 'string' && key.trim()) ? key : ''

      console.log('🔑 Checking Stripe key...')
      if (!publishableKey) {
        console.error('❌ Stripe publishable key is missing!')
        showToast('Payment system not configured. Please contact support.', 'error')
        return
      }

      console.log('✅ Stripe key found')
      console.log('🔄 Loading Stripe...')

      const stripe = await loadStripe(publishableKey)
      if (!stripe) {
        console.error('❌ Stripe failed to initialize')
        alert('Failed to load payment system. Please refresh and try again.')
        return
      }

      console.log('✅ Stripe loaded successfully')
      console.log('🔑 Getting auth token...')

      const token = await getAuthToken()
      if (!token) {
        console.error('❌ No auth token')
        showToast('Please log in to continue with checkout.', 'error')
        return
      }

      console.log('✅ Auth token obtained')



      // Validate that all cart items have valid product IDs
      const invalidItems = cartItems.filter(item => !item.productId && !item.id)
      if (invalidItems.length > 0) {
        console.error('❌ Some cart items are missing product IDs:', invalidItems)
        showToast('Some items in your cart are missing product information. Please refresh and try again.', 'error')
        return
      }

      // Get both user IDs
      const { mongoUserId, cognitoUserId } = await getUserIds()
      console.log('👤 User IDs:', { mongoUserId, cognitoUserId })

      const body = {
        items: cartItems.map(item => {
          return {
            productId: item.productId || item.id,
            name: item.name || 'Product',
            quantity: item.quantity || 1,
            price: item.price || 0,
            image: item.image || undefined
          }
        }),
        total: actualTotal,
        subtotal: subtotal,
        vat: vatAmount,
        discount: appliedDiscount ? appliedDiscount.discountAmount : couponDiscountAmount,
        discountType: appliedDiscount ? appliedDiscount.type : (appliedCoupon ? 'coupon' : null),
        couponCode: appliedCoupon ? appliedCoupon.discountCode : null,
        currency: 'usd',
        userId: mongoUserId, // MongoDB user ID
        cognitoUserId: cognitoUserId, // Cognito user ID
        deliveryAddress: selectedAddress, // Include selected delivery address
        shippingAddress: shippingSameAsDelivery ? selectedAddress : null, // Include shipping address
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout`,
        ...(mongoUserId && { mongoUserId }) // Include MongoDB userId if available
      }

      console.log('📤 Creating checkout session...')
      console.log('🔗 Endpoint:', paymentEndpoints.stripeHostedCheckout)
      console.log('📦 Payload:', body)



      const res = await fetch(paymentEndpoints.stripeHostedCheckout, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      console.log('📥 Response status:', res.status)

      if (!res.ok) {
        const text = await res.text()
        console.error('❌ API Error:', text)
        alert(`Checkout failed: ${text.substring(0, 100)}`)
        throw new Error(text)
      }

      const { data } = await res.json()
      console.log('✅ Session created:', data)

      if (!data.sessionId) {
        console.error('❌ No session ID in response')
        alert('Checkout session creation failed. Please try again.')
        return
      }

      console.log('🔄 Redirecting to Stripe checkout...')
      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId })

      if (result.error) {
        console.error('❌ Redirect error:', result.error)
        showToast(`Checkout failed: ${result.error.message}`, 'error')
      }

    } catch (e) {
      console.error('❌ Hosted checkout error:', e)
      showToast(`Checkout error: ${e.message || 'Unknown error'}`, 'error')
    }
  }

  // Qoyn validation handlers
  const handleQoynValidation = async () => {
    if (!qoynValidation.walletUnlocked || !qoynValidation.eligibleForDiscount) {
      showToast('Qoyn redemption is not available for this order', 'error')
      return
    }

    if (qoynValidation.currentDiscountQoyn <= 0) {
      showToast('No Qoyns available to apply', 'error')
      return
    }

    try {
      const result = await dispatch(validateQoynRedemption({
        totalAmount: actualTotal
      }))
      
      if (result.payload && result.payload.data && result.payload.data.order) {
        const orderData = result.payload.data.order
        setAppliedDiscount({
          type: 'qoyn',
          discountAmount: orderData.discountAmountStoreCurrency,
          totalAfterDiscount: orderData.totalAmountAfterDiscount,
          qoynAmount: qoynValidation.currentDiscountQoyn
        })
        showToast(`Applied ${qoynValidation.currentDiscountQoyn} Qoyns successfully!`, 'success')
      }
    } catch (error) {
      console.error('Qoyn validation error:', error)
      showToast('Failed to apply Qoyns. Please try again.', 'error')
    }
  }

  // Remove applied discount
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
  }
  
  // Handle coupon selection - populate the promo code input and apply
  const handleCouponSelect = (couponId) => {
    if (!couponId) {
      setSelectedCouponId('')
      setPromoCodeInput('')
      return
    }
    
    const selectedCoupon = availableCoupons.find(c => c._id === couponId)
    if (selectedCoupon) {
      setSelectedCouponId(couponId)
      setPromoCodeInput(selectedCoupon.discountCode)
      // Automatically apply the coupon when selected
      handleApplyCouponDirectly(selectedCoupon)
    }
  }
  
  // Apply coupon directly (used when clicking from dropdown)
  const handleApplyCouponDirectly = (coupon) => {
    // Clear any existing discount first
    if (appliedDiscount) {
      setAppliedDiscount(null)
    }
    
    // Apply the coupon
    dispatch(setAppliedCoupon(coupon))
    setSelectedCouponId(coupon._id)
    setPromoCodeInput(coupon.discountCode)
    showToast(`Coupon ${coupon.discountCode} applied successfully!`, 'success')
  }
  
  // Handle coupon application from promo code input
  const handleApplyCoupon = () => {
    if (!promoCodeInput.trim()) {
      showToast('Please enter or select a coupon code', 'error')
      return
    }
    
    // First check available coupons (matching cart items)
    let selectedCoupon = availableCoupons.find(c => 
      c.discountCode.toLowerCase() === promoCodeInput.trim().toLowerCase()
    )
    
    // If not found in available coupons, check all coupons from API
    if (!selectedCoupon && coupons.length > 0) {
      selectedCoupon = coupons.find(c => 
        c.discountCode.toLowerCase() === promoCodeInput.trim().toLowerCase()
      )
    }
    
    if (!selectedCoupon) {
      showToast('Invalid coupon code or coupon not available for items in cart', 'error')
      return
    }
    
    // Clear any existing discount first
    if (appliedDiscount) {
      setAppliedDiscount(null)
    }
    
    // Apply the coupon
    dispatch(setAppliedCoupon(selectedCoupon))
    setSelectedCouponId(selectedCoupon._id)
    setPromoCodeInput(selectedCoupon.discountCode) // Ensure the code is displayed
    showToast(`Coupon ${selectedCoupon.discountCode} applied successfully!`, 'success')
  }
  
  // Handle coupon removal
  const handleRemoveCoupon = () => {
    dispatch(clearAppliedCoupon())
    setSelectedCouponId('')
    setPromoCodeInput('')
    showToast('Coupon removed', 'success')
  }

  const handlePromoCodeValidation = async () => {
    if (!promoCodeInput.trim()) {
      showToast('Please enter a promo code', 'error')
      return
    }

    // Check if it's a coupon code first
    const couponMatch = coupons.find(c => 
      c.discountCode.toLowerCase() === promoCodeInput.trim().toLowerCase()
    )
    
    if (couponMatch) {
      // It's a coupon, try to apply it
      handleApplyCoupon()
      return
    }

    // For other promo codes, show not implemented message
    showToast(`Promo code "${promoCodeInput}" validation not implemented yet`, 'error')
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
                    console.log('No user found in cookies')
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
                  console.log('No user found in cookies')
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
                <div className={styles.walletBalance}>{userQoynBalance.toLocaleString()}</div>
              </div>
              <div className={styles.walletExpiry}>Expires in 29 Days</div>
            </div>

            {/* Delivery Address */}
            <div ref={addressSectionRef} className={`${styles.section} ${addressValidationError ? styles.addressError : ''}`}>
              <div className={`${styles.sectionHeader} ${addressValidationError ? styles.sectionHeaderError : ''}`}>Delivery Address</div>

              {loadingAddresses ? (
                <div className={styles.loadingText}>Loading addresses...</div>
              ) : allAddresses.length > 0 ? (
                <>
                  {/* Display existing addresses */}
                  <div className={styles.addressesList}>
                    {displayAddresses.map((address) => (
                      <div
                        key={address.id || address._id}
                        className={`${styles.addressCard} ${((selectedAddress?.id || selectedAddress?._id) === (address.id || address._id)) ? styles.selectedAddress : ''}`}
                        onClick={() => dispatch(setSelectedAddress(address))}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.addressType}>
                          <div className={styles.addressTypeInfo}>
                            {/* <FontAwesomeIcon 
                              icon={
                                address.type === 'home' ? faHome : 
                                address.type === 'work' ? faBriefcase : 
                                faMapMarkerAlt
                              } 
                              className={styles.addressTypeIcon}
                            /> */}
                            <span className={styles.addressLabel}>{address.type}</span>
                            {/* {address.isDefault && (
                              <span className={styles.defaultBadge}>Default</span>
                            )} */}
                          </div>
                          {((selectedAddress?.id || selectedAddress?._id) === (address.id || address._id)) && (
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
                        {/* {!address.isDefault && (
                          <button 
                            className={styles.setDefaultBtn}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSetDefaultAddress(address.id)
                            }}
                          >
                            Set as Default
                          </button>
                        )} */}
                      </div>
                    ))}
                  </div>

                  {/* No address selected message */}
                  {!selectedAddress && (
                    <div className={styles.noAddressSelected}>
                      <p>Please select an address to continue with your order.</p>
                    </div>
                  )}

                  {/* Button row - View More and Add New Address */}
                  <div className={styles.addressButtonsRow}>
                    {allAddresses.length > 2 && (
                      <button
                        className={styles.viewMoreBtn}
                        onClick={() => setShowAllAddresses(!showAllAddresses)}
                      >
                        {showAllAddresses ? 'View Less' : `View More`}
                      </button>
                    )}

                    <button
                      className={styles.addAddressBtn}
                      onClick={() => {
                        setAddressValidationError(false)
                        dispatch(setShowAddressForm(!showAddressForm))
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
                      Add New Address
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.noAddresses}>
                  <p>No addresses found. Please add an address to continue.</p>
                  <button
                    className={styles.addAddressBtn}
                    onClick={() => {
                      setAddressValidationError(false)
                      dispatch(setShowAddressForm(true))
                    }}
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
                        style={{ color: addressForm.type === 'home' ? '#FFFFFF' : '#000000' }}
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
                        style={{ color: addressForm.type === 'work' ? '#FFFFFF' : '#000000' }}
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
                        style={{ color: addressForm.type === 'other' ? '#FFFFFF' : '#000000' }}
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
                        setAddressValidationError(false)
                        dispatch(setShowAddressForm(false))
                      }}
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
            {/* <div className={styles.section}>
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
              {shippingSameAsDelivery && selectedAddress && (
                <div className={styles.sameAsDeliveryMessage}>
                  <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                  <span>Using the same address as delivery address</span>
                </div>
              )}
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
                        style={{ color: addressForm.type === 'home' ? '#FFFFFF' : '#000000' }}
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
                        style={{ color: addressForm.type === 'work' ? '#FFFFFF' : '#000000' }}
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
                        style={{ color: addressForm.type === 'other' ? '#FFFFFF' : '#000000' }}
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
            </div> */}

            {/* Shipping Method */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Shipping Method</div>
              <div className={styles.shippingMethodCard}>
                <span>Standard</span>
                <span className={styles.shippingTime}>3 - 5 Days</span>
              </div>
            </div>

            {/* Payment Method */}
            {/* <div className={styles.section}>
              <div className={styles.sectionHeader}>Payment Method</div>
              <div className={styles.paymentMethods}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={true}
                    readOnly
                    className={styles.paymentRadio}
                  />
                  <div className={styles.paymentContent}>
                    <div className={styles.paymentText}>Pay with Stripe</div>
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

            </div> */}
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
              <div className={styles.orderSummaryMessage}>
                <div className={styles.walletExpiry}>
                  {qoynValidation.walletUnlocked && qoynValidation.eligibleForDiscount 
                    ? `You can get Maximum of ${qoynValidation.maxDiscountInStoreCurrency} ${qoynValidation.storeCurrency} Discount if you spend ${qoynValidation.maxDiscountSpendInStoreCurrency} ${qoynValidation.storeCurrency}. Avail this Offer Now!`
                    : 'Minimum order value is AED 100 — you must spend at least AED 100 to apply Qoyns.'
                  }
                </div>
              </div>
              {qoynValidation.walletUnlocked && qoynValidation.eligibleForDiscount && (
                <>
                  <div className={styles.orderSummaryMessage1}>
                    <div className={styles.walletExpiry}>
                      Minimum order value is AED 100 — you must spend at least AED 100 to apply Qoyns.
                    </div>
                  </div>
                  {/* Qoyns Input */}
                  <div className={styles.promoCode}>
                    <input 
                      className={styles.promoInput} 
                      value={`${qoynValidation.currentDiscountQoyn || 0} Qoyns`}
                      readOnly
                      disabled={!qoynValidation.walletUnlocked || !qoynValidation.eligibleForDiscount}
                    />
                    <button 
                      className={styles.promoApplyBtn}
                      onClick={appliedDiscount ? handleRemoveDiscount : handleQoynValidation}
                      disabled={!qoynValidation.walletUnlocked || !qoynValidation.eligibleForDiscount || qoynValidation.isValidationLoading}
                    >
                      {qoynValidation.isValidationLoading ? 'Validating...' : appliedDiscount ? '✕' : 'Apply'}
                    </button>
                  </div>
                </>
              )}
              {/* <div className={styles.qoynsSliderSection}>
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
              </div> */}
              {/* Coupon Dropdown - Select and apply discount code - ONLY show matching coupons */}
              {availableCoupons.length > 0 && (
                <div className={styles.couponDropdownSection}>
                  {/* <div className={styles.couponDropdownLabel}>Select Coupon:</div> */}
                  <div className={styles.couponSelectWrapper}>
                    <select
                      className={styles.couponSelect}
                      value={appliedCoupon ? appliedCoupon._id : selectedCouponId}
                      onChange={(e) => {
                        const couponId = e.target.value
                        if (couponId) {
                          // Only allow selection from availableCoupons (matching ones)
                          const selectedCoupon = availableCoupons.find(c => c._id === couponId)
                          if (selectedCoupon) {
                            // Automatically apply the coupon when selected
                            handleApplyCouponDirectly(selectedCoupon)
                          }
                        } else {
                          // If "Choose a coupon code" is selected, remove applied coupon
                          if (appliedCoupon) {
                            handleRemoveCoupon()
                          }
                          setSelectedCouponId('')
                        }
                      }}
                      disabled={!!appliedCoupon}
                    >
                      <option value="">{appliedCoupon ? appliedCoupon.discountCode : 'Choose a coupon code'}</option>
                      {/* Only show coupons that match cart items (productId === pid) */}
                      {availableCoupons.map((coupon) => (
                        <option key={coupon._id} value={coupon._id}>
                          {coupon.discountCode} ({coupon.customerDiscountPercentage}% off)
                        </option>
                      ))}
                    </select>
                    {appliedCoupon && (
                      <button 
                        className={styles.couponRemoveBtn}
                        onClick={handleRemoveCoupon}
                        title="Remove coupon"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              )}
              {appliedCoupon && (
                <div className={styles.couponDiscountInfo}>
                  <span>Coupon {appliedCoupon.discountCode} ({appliedCoupon.customerDiscountPercentage}% off) applied: -AED {couponDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              {/* Totals */}
              {cartItems.length > 0 && (
                <div className={styles.orderTotals}>
                  <div className={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>AED {originalSubtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className={styles.totalRowDiscount}>
                      <span>Coupon Discount ({appliedCoupon.discountCode})</span>
                      <span>- AED {couponDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className={styles.totalRow}>
                    <span>Subtotal after discount</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>VAT (5%)</span>
                    <span>AED {vatAmount.toFixed(2)}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  {appliedDiscount && (
                    <div className={styles.totalRowDiscount}>
                      <span>Discount</span>
                      <span>- AED {appliedDiscount.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className={styles.totalRowFinal}>
                    <span>Order Total</span>
                    <span>AED {appliedDiscount ? appliedDiscount.totalAfterDiscount.toFixed(2) : finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
              <button
                className={styles.placeOrderBtn}
                onClick={handleHostedCheckout}
                disabled={cartItems.length === 0}
              >
                Pay with Stripe
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </div>
  )
}