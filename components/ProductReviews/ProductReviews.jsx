'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProductReviews } from '@/store/slices/reviewSlice'
import Image from 'next/image'
import styles from './ProductReviews.module.css'

/**
 * ProductReviews Component
 * Displays all reviews for a product
 * 
 * Usage:
 * <ProductReviews productId="68ebae97923c05f282009293" />
 */
export default function ProductReviews({ productId }) {
  const dispatch = useDispatch()
  const { reviews, loading, error } = useSelector(state => state.review)

  useEffect(() => {
    if (productId) {
      dispatch(getProductReviews(productId))
    }
  }, [productId, dispatch])

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading reviews...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading reviews: {error}</p>
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className={styles.noReviews}>
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? styles.starFilled : styles.starEmpty}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.reviewsContainer}>
      <h2 className={styles.reviewsTitle}>
        Customer Reviews ({reviews.length})
      </h2>

      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div key={review._id || review.id} className={styles.reviewCard}>
            {/* Review Header */}
            <div className={styles.reviewHeader}>
              <div className={styles.reviewerInfo}>
                <h3 className={styles.reviewerName}>{review.title || 'Anonymous'}</h3>
                <span className={styles.reviewDate}>
                  {formatDate(review.createdAt)}
                </span>
              </div>
              {renderStars(review.rating)}
            </div>

            {/* Review Status Badge */}
            {review.status && (
              <span className={`${styles.statusBadge} ${styles[review.status]}`}>
                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
              </span>
            )}

            {/* Verified Badge */}
            {review.isVerified && (
              <span className={styles.verifiedBadge}>
                ✓ Verified Purchase
              </span>
            )}

            {/* Review Comment */}
            <p className={styles.reviewComment}>{review.comment}</p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className={styles.reviewImages}>
                {review.images.map((imageUrl, index) => (
                  <div key={index} className={styles.reviewImageWrapper}>
                    <Image
                      src={imageUrl}
                      alt={`Review image ${index + 1}`}
                      width={100}
                      height={100}
                      className={styles.reviewImage}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pros */}
            {review.pros && review.pros.length > 0 && (
              <div className={styles.prosCons}>
                <h4 className={styles.prosTitle}>Pros:</h4>
                <ul className={styles.prosList}>
                  {review.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {review.cons && review.cons.length > 0 && (
              <div className={styles.prosCons}>
                <h4 className={styles.consTitle}>Cons:</h4>
                <ul className={styles.consList}>
                  {review.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Helpful Count */}
            <div className={styles.reviewFooter}>
              <span className={styles.helpfulCount}>
                {review.isHelpful || 0} people found this helpful
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

