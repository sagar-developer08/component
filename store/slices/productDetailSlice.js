import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { catalog } from '../api/endpoints'

// Async thunk for fetching product by ID and slug
export const fetchProductDetail = createAsyncThunk(
  'productDetail/fetchProductDetail',
  async ({ id, slug }, { rejectWithValue }) => {
    try {
      console.log('Fetching product detail:', { id, slug })
      
      // Require product ID; remove slug-only flow
      if (!id) {
        throw new Error('Product ID is required for product detail fetch')
      }

      const url = catalog.productBySlug(id, slug)
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Product detail response:', data)
      return data
    } catch (error) {
      console.error('Product detail error:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for fetching product variants (for switching between variants)
export const fetchProductVariant = createAsyncThunk(
  'productDetail/fetchProductVariant',
  async ({ id, slug }, { rejectWithValue }) => {
    try {
      console.log('Fetching product variant:', { id, slug })
      
      // Require product ID; remove slug-only flow
      if (!id) {
        throw new Error('Product ID is required for product variant fetch')
      }

      const url = catalog.productBySlug(id, slug)
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Product variant response:', data)
      return data
    } catch (error) {
      console.error('Product variant error:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for fetching all variants of a product
export const fetchProductVariants = createAsyncThunk(
  'productDetail/fetchProductVariants',
  async (parentProductId, { rejectWithValue }) => {
    try {
      console.log('Fetching product variants for parent:', parentProductId)
      const response = await fetch(catalog.productVariants(parentProductId))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Product variants response:', data)
      return data
    } catch (error) {
      console.error('Product variants error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState: {
    product: null,
    parent: null,
    variants: [],
    variantOptions: {},
    totalVariantStock: 0,
    selectedVariant: null,
    selectedAttributes: {}, // e.g., { color: 'Silver', storage: '256GB' }
    currentProductId: null, // Store the current product ID
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearProductDetail: (state) => {
      state.product = null
      state.parent = null
      state.variants = []
      state.variantOptions = {}
      state.totalVariantStock = 0
      state.selectedVariant = null
      state.selectedAttributes = {}
      state.currentProductId = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    selectVariant: (state, action) => {
      const { attributes } = action.payload
      state.selectedAttributes = attributes
      
      // Find the matching variant based on selected attributes
      const matchingVariant = state.variants.find(variant => {
        return Object.keys(attributes).every(key => 
          variant.variant_attributes?.[key] === attributes[key]
        )
      })
      
      if (matchingVariant) {
        state.selectedVariant = matchingVariant
        // Update the main product with the selected variant data
        state.product = {
          ...matchingVariant,
          // Keep some parent data
          parent_product_id: state.product?.parent_product_id,
          is_parent: false
        }
      }
    },
    setSelectedAttributes: (state, action) => {
      const { key, value } = action.payload
      state.selectedAttributes = {
        ...state.selectedAttributes,
        [key]: value
      }
      
      // Find matching variant with updated attributes
      const matchingVariant = state.variants.find(variant => {
        return Object.keys(state.selectedAttributes).every(attrKey => 
          variant.variant_attributes?.[attrKey] === state.selectedAttributes[attrKey]
        )
      })
      
      if (matchingVariant) {
        state.selectedVariant = matchingVariant
        state.product = {
          ...matchingVariant,
          parent_product_id: state.product?.parent_product_id,
          is_parent: false
        }
      }
    },
    initializeVariantSelection: (state) => {
      if (state.product && !state.product.is_parent) {
        // If we're viewing a specific variant, set it as selected
        state.selectedVariant = state.product
        state.selectedAttributes = state.product.variant_attributes || {}
      } else if (state.variants.length > 0) {
        // If we're viewing a parent product, select the first variant
        const firstVariant = state.variants[0]
        state.selectedVariant = firstVariant
        state.selectedAttributes = firstVariant.variant_attributes || {}
        state.product = {
          ...firstVariant,
          parent_product_id: state.product?.parent_product_id,
          is_parent: false
        }
      }
    },
    setProductId: (state, action) => {
      // Store the product ID for future use
      state.currentProductId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch product detail cases
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.success
        if (action.payload.success && action.payload.data) {
          const responseData = action.payload.data
          
          // Handle different response structures
          if (responseData.product) {
            // Full response with variants (original structure)
            const { product, parent, variants, variant_options, total_variant_stock } = responseData
            
            state.product = product
            state.parent = parent
            state.variants = variants || []
            state.variantOptions = variant_options || {}
            state.totalVariantStock = total_variant_stock || 0
            
            // Store the product ID for future use
            if (product && product._id) {
              state.currentProductId = product._id
            }
            
            // Initialize variant selection
            if (product && !product.is_parent) {
              state.selectedVariant = product
              state.selectedAttributes = product.variant_attributes || {}
            } else if (variants && variants.length > 0) {
              const firstVariant = variants[0]
              state.selectedVariant = firstVariant
              state.selectedAttributes = firstVariant.variant_attributes || {}
              state.product = {
                ...firstVariant,
                parent_product_id: product?.parent_product_id,
                is_parent: false
              }
              // Store the first variant's ID as current product ID
              if (firstVariant._id) {
                state.currentProductId = firstVariant._id
              }
            }
          } else {
            // Single product response (new structure)
            const product = responseData
            
            state.product = product
            state.parent = null
            state.variants = []
            state.variantOptions = {}
            state.totalVariantStock = 0
            
            // Store the product ID for future use
            if (product && product._id) {
              state.currentProductId = product._id
            }
            
            // Set current product as selected variant
            state.selectedVariant = product
            state.selectedAttributes = product.variant_attributes || {}
            
            // Generate variant options from the current product's attributes
            if (product.variant_attributes) {
              state.variantOptions = {
                color: product.variant_attributes.color ? [product.variant_attributes.color] : [],
                storage: product.variant_attributes.storage ? [product.variant_attributes.storage] : []
              }
            }
          }
        }
        state.error = null
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Fetch product variant cases
      .addCase(fetchProductVariant.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductVariant.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.success
        if (action.payload.success && action.payload.data) {
          const { product } = action.payload.data
          
          // Update the current product with the new variant
          state.product = product
          state.selectedVariant = product
          state.selectedAttributes = product.variant_attributes || {}
        }
        state.error = null
      })
      .addCase(fetchProductVariant.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Fetch product variants cases
      .addCase(fetchProductVariants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductVariants.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.success
        if (action.payload.success && action.payload.data) {
          const variants = Array.isArray(action.payload.data) ? action.payload.data : action.payload.data.variants || []
          state.variants = variants
          
          // Generate variant options from variants
          const colorOptions = new Set()
          const storageOptions = new Set()
          
          variants.forEach(variant => {
            if (variant.variant_attributes) {
              if (variant.variant_attributes.color) {
                colorOptions.add(variant.variant_attributes.color)
              }
              if (variant.variant_attributes.storage) {
                storageOptions.add(variant.variant_attributes.storage)
              }
            }
          })
          
          // Only set variant options if there are multiple options
          state.variantOptions = {
            color: colorOptions.size > 1 ? Array.from(colorOptions) : [],
            storage: storageOptions.size > 1 ? Array.from(storageOptions) : []
          }
        }
        state.error = null
      })
      .addCase(fetchProductVariants.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  }
})

export const { 
  clearProductDetail, 
  clearError, 
  selectVariant, 
  setSelectedAttributes,
  initializeVariantSelection,
  setProductId 
} = productDetailSlice.actions

export default productDetailSlice.reducer
