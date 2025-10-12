'use client'
import { useState } from 'react'
import { createReviewWithImages, validateRating } from '@/utils/reviewUploadHelper'
import styles from './ReviewForm.module.css'

/**
 * ReviewForm Component
 * Allows users to submit product reviews with:
 * - Star rating (1-5)
 * - Review title
 * - Comment
 * - Image uploads (up to 5)
 * - Pros/Cons
 */
export default function ReviewForm({ productId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    pros: '',
    cons: ''
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length + imageFiles.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    if (validFiles.length !== files.length) {
      setError('Only image files are allowed')
      return
    }

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    
    setImageFiles(prev => [...prev, ...validFiles])
    setImagePreviews(prev => [...prev, ...newPreviews])
    setError('')
  }

  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index)
      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(prev[index])
      return newPreviews
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate rating
    const ratingValidation = validateRating(formData.rating)
    if (!ratingValidation.isValid) {
      setError(ratingValidation.error)
      return
    }

    // Validate comment
    if (!formData.comment.trim()) {
      setError('Review comment is required')
      return
    }

    if (formData.comment.length > 2000) {
      setError('Review comment must be less than 2000 characters')
      return
    }

    setLoading(true)

    try {
      // Convert pros/cons from comma-separated string to array
      const prosArray = formData.pros
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0)
      
      const consArray = formData.cons
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0)

      // Create review with images
      const reviewResult = await createReviewWithImages({
        productId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        imageFiles,
        pros: prosArray,
        cons: consArray
      })

      console.log('✅ Review created:', reviewResult)
      
      // Clear form
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        pros: '',
        cons: ''
      })
      setImageFiles([])
      setImagePreviews([])

      // Call success callback
      if (onSuccess) {
        onSuccess(reviewResult)
      }

    } catch (err) {
      console.error('Error creating review:', err)
      setError(err.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.reviewForm}>
      <h2 className={styles.formTitle}>Write a Review</h2>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Rating *</label>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.star} ${
                  star <= (hoveredRating || formData.rating) ? styles.starFilled : ''
                }`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </button>
            ))}
            <span className={styles.ratingText}>
              {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Select rating'}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Review Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Summarize your review"
            maxLength={100}
          />
        </div>

        {/* Review Comment */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Review Comment *</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Share your thoughts about this product..."
            maxLength={2000}
            rows={6}
            required
          />
          <div className={styles.charCount}>
            {formData.comment.length}/2000 characters
          </div>
        </div>

        {/* Image Upload */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Add Photos (Optional)</label>
          <div className={styles.imageUploadSection}>
            {imagePreviews.length < 5 && (
              <label className={styles.uploadButton}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Add Photo</span>
              </label>
            )}
            
            <div className={styles.imagePreviews}>
              {imagePreviews.map((preview, index) => (
                <div key={index} className={styles.imagePreview}>
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.imageHint}>
            {imageFiles.length}/5 images • Max 5 images per review
          </div>
        </div>

        {/* Pros */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Pros (Optional)</label>
          <input
            type="text"
            name="pros"
            value={formData.pros}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Separate pros with commas"
          />
          <div className={styles.hint}>
            Example: Fast delivery, Good quality, Great price
          </div>
        </div>

        {/* Cons */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Cons (Optional)</label>
          <input
            type="text"
            name="cons"
            value={formData.cons}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Separate cons with commas"
          />
          <div className={styles.hint}>
            Example: Expensive, Slow shipping
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || formData.rating === 0}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

