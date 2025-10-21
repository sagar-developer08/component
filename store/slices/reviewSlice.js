import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { upload, review } from '../api/endpoints'
import { decryptText } from '../../utils/crypto'

// Get auth token helper
const getAuthToken = async () => {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';').map(c => c.trim())
  const tokenCookie = cookies.find(c => c.startsWith('accessToken='))
  
  if (tokenCookie) {
    try {
      const enc = decodeURIComponent(tokenCookie.split('=')[1] || '')
      return await decryptText(enc)
    } catch (err) {
      console.error('Error decrypting token:', err)
      return null
    }
  }
  
  return null
}

// Upload review images to S3
export const uploadReviewImages = createAsyncThunk(
  'review/uploadImages',
  async (imageFiles, { rejectWithValue }) => {
    try {
      if (!imageFiles || imageFiles.length === 0) {
        return []
      }

      if (imageFiles.length > 5) {
        throw new Error('Maximum 5 images allowed per review')
      }

      const token = await getAuthToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const formData = new FormData()
      imageFiles.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch(upload.reviewImages, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload images')
      }

      // Return array of URLs
      return data.data.map(result => result.url)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Create product review
export const createProductReview = createAsyncThunk(
  'review/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const {
        productId,
        rating,
        name,
        comment,
        imageFiles = []
      } = reviewData

      // Validate required fields
      if (!productId) {
        throw new Error('Product ID is required')
      }

      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5 stars')
      }

      if (!comment || comment.trim().length === 0) {
        throw new Error('Review comment is required')
      }

      const token = await getAuthToken()

      // Step 1: Upload images if provided (only if token available)
      let imageUrls = []
      if (imageFiles.length > 0 && token) {
        const formData = new FormData()
        imageFiles.forEach((file) => {
          formData.append('files', file)
        })

        const uploadResponse = await fetch(upload.reviewImages, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        const uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || 'Failed to upload images')
        }

        imageUrls = uploadData.data.map(result => result.url)
      }

      // Step 2: Create review with image URLs
      const reviewPayload = {
        productId,
        rating: parseInt(rating),
        title: name || '',
        comment: comment.trim(),
        images: imageUrls,
        pros: [],
        cons: []
      }

      // Use direct endpoint by product ID (bypasses validation and auth)
      const endpoint = review.createByProductId(productId)

      // Build headers conditionally based on token availability
      const headers = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(reviewPayload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create review')
      }

      return data.data.review

    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Get reviews for a product
export const getProductReviews = createAsyncThunk(
  'review/getProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      console.log('Fetching reviews for product:', productId)
      const response = await fetch(review.getByProduct(productId))
      const data = await response.json()

      console.log('Reviews API response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews')
      }

      // API returns data with reviews array inside data object
      return {
        reviews: data.data?.reviews || [],
        total: data.data?.pagination?.total || 0,
        statistics: data.data?.statistics || null
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  reviews: [],
  currentReview: null,
  uploadedImages: [],
  loading: false,
  uploadingImages: false,
  error: null,
  success: false,
  total: 0,
  statistics: null
}

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviewState: (state) => {
      state.loading = false
      state.uploadingImages = false
      state.error = null
      state.success = false
      state.uploadedImages = []
      state.currentReview = null
    },
    clearUploadedImages: (state) => {
      state.uploadedImages = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload images
      .addCase(uploadReviewImages.pending, (state) => {
        state.uploadingImages = true
        state.error = null
      })
      .addCase(uploadReviewImages.fulfilled, (state, action) => {
        state.uploadingImages = false
        state.uploadedImages = action.payload
        state.error = null
      })
      .addCase(uploadReviewImages.rejected, (state, action) => {
        state.uploadingImages = false
        state.error = action.payload
      })
      // Create review
      .addCase(createProductReview.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.loading = false
        state.currentReview = action.payload
        state.success = true
        state.error = null
        state.uploadedImages = []
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      // Get reviews
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false
        state.reviews = action.payload.reviews || []
        state.total = action.payload.total || 0
        state.statistics = action.payload.statistics || null
        state.error = null
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.reviews = []
      })
  }
})

export const { clearReviewState, clearUploadedImages } = reviewSlice.actions
export default reviewSlice.reducer

