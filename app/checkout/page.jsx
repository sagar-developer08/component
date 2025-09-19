'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addresses } from '@/store/api/endpoints'
import { getAuthToken, getUserFromCookies } from '@/utils/userUtils'
import { fetchCart } from '@/store/slices/cartSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBriefcase, faMapMarkerAlt, faCheck, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import styles from './checkout.module.css'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const { items: cartItems, total: cartTotal, loading: cartLoading } = useSelector(state => state.cart)
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card')
  const [userAddresses, setUserAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shippingSameAsDelivery, setShippingSameAsDelivery] = useState(true)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    isDefault: false,
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    landmark: '',
    instructions: ''
  })

  // Fetch user addresses and cart on component mount
  useEffect(() => {
    const loadCheckoutData = async () => {
      // Load addresses
      await fetchUserAddresses()
      
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
            setError('Unable to get user information')
          }
        } else {
          setError('Please login to proceed with checkout')
        }
      } catch (error) {
        console.error('Error loading cart:', error)
        setError('Failed to load cart data')
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
  }, [cartItems, cartTotal, cartLoading])

  // Check if cart is empty and show appropriate message
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      setError('Your cart is empty. Please add items to proceed with checkout.')
    } else if (cartItems.length > 0) {
      // Clear error if cart has items
      setError(null)
    }
  }, [cartItems.length, cartLoading])

  const fetchUserAddresses = async () => {
    try {
      setLoading(true)
      const token = await getAuthToken()
      
      if (!token) {
        console.error('No authentication token found')
        setLoading(false)
        return
      }

      const response = await fetch(addresses.get, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const responseData = await response.json()
        // Extract addresses from the nested structure
        const addresses = responseData.data?.addresses || []
        setUserAddresses(addresses)
        
        // Set default address if available
        const defaultAddress = addresses.find(addr => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress)
        } else if (addresses.length > 0) {
          setSelectedAddress(addresses[0])
        }
      } else {
        const errorData = await response.json()
        console.error('Error fetching addresses:', errorData)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const token = await getAuthToken()
      
      if (!token) {
        setError('Authentication required. Please login again.')
        setIsSubmitting(false)
        return
      }

      const response = await fetch(addresses.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressForm)
      })

      if (response.ok) {
        setShowAddressForm(false)
        setAddressForm({
          type: 'home',
          isDefault: false,
          fullName: '',
          phone: '',
          email: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          landmark: '',
          instructions: ''
        })
        await fetchUserAddresses() // Refresh addresses
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create address')
        console.error('Error creating address:', errorData)
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Error creating address:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const setDefaultAddress = async (addressId) => {
    try {
      const token = await getAuthToken()
      
      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch(addresses.setDefault, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ addressId })
      })

      if (response.ok) {
        fetchUserAddresses() // Refresh addresses
      } else {
        const errorData = await response.json()
        console.error('Error setting default address:', errorData)
      }
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    setIsPlacingOrder(true)
    setError(null)

    try {
      const token = await getAuthToken()
      
      if (!token) {
        setError('Authentication required. Please login again.')
        setIsPlacingOrder(false)
        return
      }

      // Prepare order data
      const orderData = {
        items: cartItems,
        deliveryAddress: selectedAddress,
        shippingAddress: shippingSameAsDelivery ? selectedAddress : null, // You might want to add shipping address form data here
        paymentMethod: selectedPaymentMethod,
        total: cartTotal,
        subtotal: cartTotal,
        vat: cartTotal * 0.05,
        shipping: 0, // Free shipping
        discount: 0
      }

      // Here you would call your order API
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(orderData)
      // })

      // For now, we'll just simulate success
      console.log('Order placed successfully:', orderData)
      
      // Show success message
      alert('Order placed successfully!')
      
      // Redirect to order confirmation or home page
      window.location.href = '/'
      
    } catch (error) {
      setError('Failed to place order. Please try again.')
      console.error('Error placing order:', error)
    } finally {
      setIsPlacingOrder(false)
    }
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
              
              {loading ? (
                <div className={styles.loadingText}>Loading addresses...</div>
              ) : userAddresses.length > 0 ? (
                <>
                  {/* Display existing addresses */}
                  <div className={styles.addressesList}>
                    {userAddresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`${styles.addressCard} ${selectedAddress?.id === address.id ? styles.selectedAddress : ''}`}
                        onClick={() => setSelectedAddress(address)}
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
                              setDefaultAddress(address.id)
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
                    onClick={() => setShowAddressForm(!showAddressForm)}
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
                    onClick={() => setShowAddressForm(true)}
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
                      onClick={() => setAddressForm({...addressForm, type: 'home'})}
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
                      onClick={() => setAddressForm({...addressForm, type: 'work'})}
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
                      onClick={() => setAddressForm({...addressForm, type: 'other'})}
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
                      onChange={(e) => setAddressForm({...addressForm, type: e.target.value})}
                    />
                </div>
                <div className={styles.addressFormGrid}>
                    <input 
                      className={styles.addressInput} 
                      placeholder="Full Name"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Phone"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Email"
                      type="email"
                      value={addressForm.email}
                      onChange={(e) => setAddressForm({...addressForm, email: e.target.value})}
                      required
                    />
                    <select 
                      className={styles.addressInput}
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
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
                      onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
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
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Postal Code"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Address Line 1"
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Address Line 2"
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Landmark"
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                    />
                    <textarea 
                      className={styles.addressInput} 
                      placeholder="Delivery Instructions"
                      value={addressForm.instructions}
                      onChange={(e) => setAddressForm({...addressForm, instructions: e.target.value})}
                      rows="3"
                    />
                </div>
                <div className={styles.addressFormActions}>
                    <button 
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className={styles.saveBtn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
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
                    setShippingSameAsDelivery(true)
                    setShowShippingForm(false)
                  }}
                >
                  Same as Delivery Address
                </button>
                <button 
                  className={!shippingSameAsDelivery ? styles.shippingTab1 : styles.shippingTab}
                  onClick={() => {
                    setShippingSameAsDelivery(false)
                    setShowShippingForm(true)
                  }}
                >
                  Use a Different Address
                </button>
              </div>
              
              {/* Show selected delivery address if same as delivery */}
              {shippingSameAsDelivery && selectedAddress && (
                <div className={styles.selectedAddressCard}>
                  <div className={styles.addressType}>
                    <div className={styles.addressTypeInfo}>
                      <FontAwesomeIcon 
                        icon={
                          selectedAddress.type === 'home' ? faHome : 
                          selectedAddress.type === 'work' ? faBriefcase : 
                          faMapMarkerAlt
                        } 
                        className={styles.addressTypeIcon}
                      />
                      <span className={styles.addressLabel}>{selectedAddress.type}</span>
                      {selectedAddress.isDefault && (
                        <span className={styles.defaultBadge}>Default</span>
                      )}
                    </div>
                    <div className={styles.selectedIndicator}>
                      <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                    </div>
                  </div>
                  <div className={styles.addressDetails}>
                    <div className={styles.addressText}>
                      {selectedAddress.addressLine1}
                      {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                    </div>
                    <div className={styles.addressLocation}>
                      {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                    </div>
                    <div className={styles.addressContact}>{selectedAddress.phone}</div>
                    <div className={styles.addressContact}>{selectedAddress.email}</div>
                  </div>
                </div>
              )}

              {/* Shipping Address Form - Only show if different address is selected */}
              {!shippingSameAsDelivery && showShippingForm && (
                <form className={styles.addressForm} onSubmit={handleAddressSubmit}>
                <div className={styles.addressFormTabs}>
                    <button 
                      type="button"
                      className={`${styles.addressTab} ${addressForm.type === 'home' ? styles.active : ''}`}
                      onClick={() => setAddressForm({...addressForm, type: 'home'})}
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
                      onClick={() => setAddressForm({...addressForm, type: 'work'})}
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
                      onClick={() => setAddressForm({...addressForm, type: 'other'})}
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
                      onChange={(e) => setAddressForm({...addressForm, type: e.target.value})}
                    />
                </div>
                <div className={styles.addressFormGrid}>
                    <input 
                      className={styles.addressInput} 
                      placeholder="Full Name"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Phone"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Email"
                      type="email"
                      value={addressForm.email}
                      onChange={(e) => setAddressForm({...addressForm, email: e.target.value})}
                      required
                    />
                    <select 
                      className={styles.addressInput}
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
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
                      onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
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
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Postal Code"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Address Line 1"
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                      required
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Address Line 2"
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
                    />
                    <input 
                      className={styles.addressInput} 
                      placeholder="Landmark"
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                    />
                    <textarea 
                      className={styles.addressInput} 
                      placeholder="Delivery Instructions"
                      value={addressForm.instructions}
                      onChange={(e) => setAddressForm({...addressForm, instructions: e.target.value})}
                      rows="3"
                    />
                </div>
                <div className={styles.addressFormActions}>
                    <button 
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => {
                        setShowShippingForm(false)
                        setShippingSameAsDelivery(true)
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
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
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
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
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
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className={styles.paymentRadio}
                  />
                  <div className={styles.paymentContent}>
                    <div className={styles.paymentText}>
                      Pay With <span className={styles.paymentBadgeTamara}>tamara</span>
                    </div>
                  </div>
                </label>
              </div>
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
                        src={item.product?.images?.[0] || "/images/placeholder.jpg"}
                        alt={item.product?.name || "Product"}
                  width={60}
                  height={60}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                        <div className={styles.productBrand}>{item.product?.brand || "Brand"}</div>
                        <div className={styles.productName}>{item.product?.name || "Product Name"}</div>
                        <div className={styles.productQuantity}>Qty: {item.quantity}</div>
                      </div>
                      <div className={styles.productPrice}>AED {item.product?.price || 0}</div>
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
                    <span>AED {cartTotal.toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className={styles.totalRow}>
                  <span>VAT</span>
                    <span>AED {(cartTotal * 0.05).toFixed(2)}</span>
                </div>
                <div className={styles.totalRowDiscount}>
                  <span>Discount</span>
                    <span>- AED 0.00</span>
                </div>
                <div className={styles.totalRowFinal}>
                  <span>Order Total</span>
                    <span>AED {(cartTotal * 1.05).toFixed(2)}</span>
                  </div>
                </div>
              )}
              <button 
                className={styles.placeOrderBtn}
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || cartItems.length === 0}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}