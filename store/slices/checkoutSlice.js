import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAuthToken } from '../../utils/userUtils'
import { addresses, payment } from '../api/endpoints'

// Async thunks for checkout operations
export const fetchUserAddresses = createAsyncThunk(
  'checkout/fetchUserAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAuthToken()
      
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(addresses.get, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch addresses')
      }

      const responseData = await response.json()
      return responseData.data?.addresses || []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createAddress = createAsyncThunk(
  'checkout/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const token = await getAuthToken()
      
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(addresses.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create address')
      }

      const responseData = await response.json()
      return responseData
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const setDefaultAddress = createAsyncThunk(
  'checkout/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const token = await getAuthToken()
      
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(addresses.setDefault, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ addressId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to set default address')
      }

      return addressId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createStripePaymentIntent = createAsyncThunk(
  'checkout/createStripePaymentIntent',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = await getAuthToken()
      
      if (!token) {
        throw new Error('Authentication required')
      }

      // Handle Stripe payment
      const stripeCheckoutData = {
        items: orderData.items.map(item => ({
          productId: item.productId || item.id || `product_${Math.random().toString(36).substr(2, 9)}`,
          name: item.name || 'Product',
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: item.image || 'https://example.com/image.jpg'
        })),
        currency: 'usd'
      }

      const response = await fetch(payment.stripeCheckout, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stripeCheckoutData)
      })

      if (!response.ok) {
        // Robust error handling when server returns non-JSON (e.g., HTML error page)
        const raw = await response.text()
        try {
          const errorData = JSON.parse(raw)
          throw new Error(errorData.message || 'Failed to create payment intent')
        } catch (_) {
          // Surface status and a snippet of the body to help debugging
          const snippet = (raw || '').slice(0, 200)
          throw new Error(`Payment API error (${response.status}): ${snippet}`)
        }
      }

      const responseData = await response.json()
      
      return {
        type: 'stripe',
        clientSecret: responseData.data?.clientSecret,
        paymentIntentId: responseData.data?.paymentIntentId,
        totalAmount: responseData.data?.totalAmount,
        currency: responseData.data?.currency,
        paymentData: responseData.data
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const placeOrder = createAsyncThunk(
  'checkout/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = await getAuthToken()
      
      if (!token) {
        throw new Error('Authentication required')
      }

      if (orderData.paymentMethod === 'credit-card') {
        // For Stripe, we just return the order data
        // The actual payment will be handled by Stripe Elements
        return {
          type: 'stripe',
          orderData,
          message: 'Payment intent created. Please complete payment.'
        }
      } else {
        // Handle other payment methods (tabby, tamara)
        return {
          type: 'other',
          orderData,
          message: 'Order placed successfully!'
        }
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    // Address management
    addresses: [],
    selectedAddress: null,
    loadingAddresses: false,
    addressError: null,
    
    // Address form
    showAddressForm: false,
    addressForm: {
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
    },
    isSubmittingAddress: false,
    
    // Shipping
    shippingSameAsDelivery: true,
    showShippingForm: false,
    
    // Payment
    selectedPaymentMethod: 'credit-card',
    
    // Stripe payment
    stripeClientSecret: null,
    stripePaymentIntentId: null,
    isCreatingPaymentIntent: false,
    paymentIntentError: null,
    
    // Order placement
    isPlacingOrder: false,
    orderError: null,
    
    // General
    loading: false,
    error: null
  },
  reducers: {
    // Address management
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload
    },
    setShowAddressForm: (state, action) => {
      state.showAddressForm = action.payload
    },
    updateAddressForm: (state, action) => {
      state.addressForm = { ...state.addressForm, ...action.payload }
    },
    resetAddressForm: (state) => {
      state.addressForm = {
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
      }
    },
    
    // Shipping
    setShippingSameAsDelivery: (state, action) => {
      state.shippingSameAsDelivery = action.payload
    },
    setShowShippingForm: (state, action) => {
      state.showShippingForm = action.payload
    },
    
    // Payment
    setSelectedPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null
      state.addressError = null
      state.orderError = null
      state.paymentIntentError = null
    },
    clearAddressError: (state) => {
      state.addressError = null
    },
    clearOrderError: (state) => {
      state.orderError = null
    },
    clearPaymentIntentError: (state) => {
      state.paymentIntentError = null
    },
    clearStripeData: (state) => {
      state.stripeClientSecret = null
      state.stripePaymentIntentId = null
      state.paymentIntentError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loadingAddresses = true
        state.addressError = null
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loadingAddresses = false
        state.addresses = action.payload
        
        // Set default address if available
        const defaultAddress = action.payload.find(addr => addr.isDefault)
        if (defaultAddress) {
          state.selectedAddress = defaultAddress
        } else if (action.payload.length > 0) {
          state.selectedAddress = action.payload[0]
        }
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loadingAddresses = false
        state.addressError = action.payload
      })
      
      // Create address
      .addCase(createAddress.pending, (state) => {
        state.isSubmittingAddress = true
        state.addressError = null
      })
      .addCase(createAddress.fulfilled, (state) => {
        state.isSubmittingAddress = false
        state.showAddressForm = false
        state.addressForm = {
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
        }
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.isSubmittingAddress = false
        state.addressError = action.payload
      })
      
      // Set default address
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        // Update the addresses array to reflect the new default
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === action.payload
        }))
      })
      
      // Create Stripe Payment Intent
      .addCase(createStripePaymentIntent.pending, (state) => {
        state.isCreatingPaymentIntent = true
        state.paymentIntentError = null
      })
      .addCase(createStripePaymentIntent.fulfilled, (state, action) => {
        state.isCreatingPaymentIntent = false
        state.stripeClientSecret = action.payload.clientSecret
        state.stripePaymentIntentId = action.payload.paymentIntentId
      })
      .addCase(createStripePaymentIntent.rejected, (state, action) => {
        state.isCreatingPaymentIntent = false
        state.paymentIntentError = action.payload
      })
      
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.isPlacingOrder = true
        state.orderError = null
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isPlacingOrder = false
        
        if (action.payload.type === 'stripe') {
          // For Stripe, payment will be handled by Stripe Elements
          // No redirect needed
        } else if (action.payload.type === 'other') {
          // Show success message and redirect (use native event to allow UI-level toast)
          if (typeof window !== 'undefined') {
            const ev = new CustomEvent('app:toast', { detail: { message: action.payload.message, type: 'success' } })
            window.dispatchEvent(ev)
          }
          window.location.href = '/'
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isPlacingOrder = false
        state.orderError = action.payload
      })
  }
})

export const {
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
} = checkoutSlice.actions

export default checkoutSlice.reducer
