/**
 * Review Upload Helper
 * 
 * This helper demonstrates how to upload review images and create a review with ratings (1-5 stars)
 */

import { upload, review } from '@/store/api/endpoints'
import { decryptText } from './crypto'

/**
 * Get authentication token from cookies
 */
export const getAuthToken = async () => {
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

/**
 * Upload review images to S3
 * 
 * @param {File[]} imageFiles - Array of image files (max 5)
 * @returns {Promise<Array>} Array of uploaded image URLs
 * 
 * @example
 * const imageFiles = [file1, file2, file3]
 * const imageUrls = await uploadReviewImages(imageFiles)
 * // Returns: ['https://bucket.s3.amazonaws.com/reviews/image1.jpg', ...]
 */
export const uploadReviewImages = async (imageFiles) => {
  if (!imageFiles || imageFiles.length === 0) {
    return []
  }

  if (imageFiles.length > 5) {
    throw new Error('Maximum 5 images allowed per review')
  }

  const token = await getAuthToken()
  if (!token) {
    throw new Error('Authentication required. Please login.')
  }

  const formData = new FormData()
  
  // Append all images
  imageFiles.forEach((file) => {
    formData.append('files', file)
  })

  try {
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

    // Extract URLs from upload results
    return data.data.map(result => result.url)
  } catch (error) {
    console.error('Review image upload error:', error)
    throw error
  }
}

/**
 * Create a product review with images and rating
 * 
 * @param {Object} reviewData - Review data
 * @param {string} reviewData.productId - Product ID
 * @param {number} reviewData.rating - Rating from 1 to 5 stars
 * @param {string} reviewData.title - Review title
 * @param {string} reviewData.comment - Review comment
 * @param {File[]} reviewData.imageFiles - Array of image files (optional, max 5)
 * @param {string[]} reviewData.pros - Array of pros (optional)
 * @param {string[]} reviewData.cons - Array of cons (optional)
 * @returns {Promise<Object>} Created review data
 * 
 * @example
 * const reviewData = {
 *   productId: '68dce0040e29f02bb591da9b',
 *   rating: 4, // 1-5 stars
 *   title: 'Great product!',
 *   comment: 'I really love this product. It works perfectly.',
 *   imageFiles: [file1, file2], // Optional
 *   pros: ['Fast delivery', 'Good quality'],
 *   cons: ['A bit expensive']
 * }
 * const review = await createReviewWithImages(reviewData)
 */
export const createReviewWithImages = async (reviewData) => {
  const {
    productId,
    rating,
    title,
    comment,
    imageFiles = [],
    pros = [],
    cons = []
  } = reviewData

  // Validate rating (must be 1-5)
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5 stars')
  }

  // Validate required fields
  if (!productId) {
    throw new Error('Product ID is required')
  }

  if (!comment || comment.trim().length === 0) {
    throw new Error('Review comment is required')
  }

  const token = await getAuthToken()
  if (!token) {
    throw new Error('Authentication required. Please login.')
  }

  try {
    // Step 1: Upload images if provided
    let imageUrls = []
    if (imageFiles.length > 0) {
      console.log(`📤 Uploading ${imageFiles.length} review images...`)
      imageUrls = await uploadReviewImages(imageFiles)
      console.log(`✅ Images uploaded successfully: ${imageUrls.length} URLs`)
    }

    // Step 2: Create review with image URLs
    const reviewPayload = {
      productId,
      rating: parseInt(rating),
      title: title || '',
      comment: comment.trim(),
      images: imageUrls,
      pros,
      cons
    }

    console.log('📝 Creating review with payload:', {
      productId: reviewPayload.productId,
      rating: reviewPayload.rating,
      imageCount: reviewPayload.images.length
    })

    const response = await fetch(review.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewPayload)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create review')
    }

    console.log('✅ Review created successfully:', data.data.review.id)
    
    return data.data.review

  } catch (error) {
    console.error('Create review error:', error)
    throw error
  }
}

/**
 * Star rating component helper
 * Converts numeric rating (1-5) to star display
 * 
 * @param {number} rating - Rating from 1 to 5
 * @returns {string} Star string representation
 * 
 * @example
 * getStarDisplay(4) // Returns: '★★★★☆'
 * getStarDisplay(5) // Returns: '★★★★★'
 * getStarDisplay(2.5) // Returns: '★★⯨☆☆'
 */
export const getStarDisplay = (rating) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '⯨' : '') + 
         '☆'.repeat(emptyStars)
}

/**
 * Validate rating value
 * 
 * @param {number} rating - Rating to validate
 * @returns {Object} Validation result
 */
export const validateRating = (rating) => {
  const numRating = Number(rating)
  
  if (isNaN(numRating)) {
    return { isValid: false, error: 'Rating must be a number' }
  }
  
  if (numRating < 1 || numRating > 5) {
    return { isValid: false, error: 'Rating must be between 1 and 5' }
  }
  
  return { isValid: true, value: numRating }
}

