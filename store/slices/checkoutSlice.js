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

export const placeOrder = createAsyncThunk(
  'checkout/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = await getAuthToken()
      
      if (!token) {
        throw new Error('Authentication required')
      }

      if (orderData.paymentMethod === 'credit-card') {
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
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to process payment')
        }

        const responseData = await response.json()
        
        // Call webhook to get Stripe checkout URL
        const webhookRes = await fetch('https://backendcart.qliq.ae/api/payment/stripe/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentIntentId: responseData.data?.paymentIntentId,
            clientSecret: responseData.data?.clientSecret,
            totalAmount: responseData.data?.totalAmount,
            currency: responseData.data?.currency,
            status: responseData.data?.status
          })
        })

        if (webhookRes.ok) {
          const webhookData = await webhookRes.json()
          return {
            type: 'stripe',
            checkoutUrl: webhookData.checkout_url,
            paymentData: responseData.data
          }
        } else {
          throw new Error('Failed to get checkout URL')
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
    },
    clearAddressError: (state) => {
      state.addressError = null
    },
    clearOrderError: (state) => {
      state.orderError = null
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
      
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.isPlacingOrder = true
        state.orderError = null
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isPlacingOrder = false
        
        if (action.payload.type === 'stripe' && action.payload.checkoutUrl) {
          // Redirect to Stripe checkout
          window.location.href = action.payload.checkoutUrl
        } else if (action.payload.type === 'other') {
          // Show success message and redirect
          alert(action.payload.message)
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
  clearOrderError
} = checkoutSlice.actions

export default checkoutSlice.reducer
