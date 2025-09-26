'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import styles from './orderHistory.module.css';
import Image from 'next/image';

const OrderHistoryPage = () => {
  const [rating, setRating] = useState(3);
  const [reviewData, setReviewData] = useState({
    name: '',
    photo: '',
    review: ''
  });

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewData(prev => ({
        ...prev,
        photo: file.name
      }));
    }
  };

  const handleSubmitReview = () => {
    console.log('Review submitted:', { rating, ...reviewData });
    // Handle review submission logic here
  };

  const handleCancelReview = () => {
    setReviewData({ name: '', photo: '', review: '' });
    setRating(3);
  };

  return (
    <div>
      <Navigation />
      <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <button className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 className={styles.orderNumber}>ORDER #400-4109943-785621</h1>
      </div>

      {/* Order Information Card */}
      <div className={styles.orderInfoCard}>
        <div className={styles.orderInfoLeft}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Order Placed</span>
            <span className={styles.infoValue}>17 September 2025</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Order Number</span>
            <span className={styles.infoValue}>400-4109943-785621</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Payment Method</span>
            <span className={styles.infoValue}>Credit/Debit Card</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Order Status</span>
            <span className={`${styles.infoValue} ${styles.deliveredStatus}`}>Delivered</span>
          </div>
        </div>
      </div>

      {/* Address and Review Section */}
      <div className={styles.contentGrid}>
        {/* Address Cards Row */}
        <div className={styles.addressRow}>
          {/* Delivery Address Card */}
          <div className={styles.addressCard}>
            <h3 className={styles.cardTitle}>Delivery Address</h3>
            <div className={styles.addressContent}>
              <span className={styles.addressType}>Home</span>
              <p className={styles.addressText}>
                Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>
              <div className={styles.contactInfo}>
                <span className={styles.contactNumber}>970 500 500</span>
                <span className={styles.contactEmail}>example@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className={styles.addressCard}>
            <h3 className={styles.cardTitle}>Shipping Address</h3>
            <div className={styles.addressContent}>
              <span className={styles.addressType}>Home</span>
              <p className={styles.addressText}>
                Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>
              <div className={styles.contactInfo}>
                <span className={styles.contactNumber}>970 500 500</span>
                <span className={styles.contactEmail}>example@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Review and Order Summary */}
        <div className={styles.bottomRow}>
          {/* Write a Review Card */}
          <div className={styles.reviewCard}>
            <h3 className={styles.cardTitle}>Write a review</h3>
            <div className={styles.reviewForm}>
              <div className={styles.ratingSection}>
                <label className={styles.formLabel}>Rating</label>
                <div className={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`${styles.star} ${star <= rating ? styles.starFilled : styles.starEmpty}`}
                      onClick={() => handleRatingChange(star)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="name"
                  value={reviewData.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter your name"
                />
              </div>

              <div className={styles.formGroup}>
                <div 
                  className={styles.uploadInput}
                  onClick={() => document.getElementById('photo-upload').click()}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="file"
                    id="photo-upload"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <input
                    type="text"
                    value={reviewData.photo}
                    className={styles.formInput}
                    placeholder="Choose file"
                    readOnly
                    style={{ cursor: 'pointer' }}
                  />
                  <button 
                    type="button"
                    className={styles.uploadButton}
                    style={{ cursor: 'pointer' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <textarea
                  name="review"
                  value={reviewData.review}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Write your review here..."
                  rows="4"
                />
              </div>

              <div className={styles.reviewButtons}>
                <button className={styles.cancelButton} onClick={handleCancelReview}>
                  Cancel
                </button>
                <button className={styles.submitButton} onClick={handleSubmitReview}>
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className={styles.orderSummaryCard}>
            <h3 className={styles.cardTitle}>Order Summary</h3>
            <div className={styles.productSection}>
              <div className={styles.productImage}>
                <Image
                  src="/images/nike-airforce-01-white.jpg"
                  alt="Nike Airforce 01"
                  width={60}
                  height={60}
                  className={styles.productImg}
                />
              </div>
              <div className={styles.productDetails}>
              <h6 className={styles.productBrand}>Nike</h6>
                <h4 className={styles.productName}>Airforce 01</h4>
                <p className={styles.productQuantity}>Qty: 1</p>
                <p className={styles.productPrice}>AED 1,200</p>
              </div>
            </div>

            <div className={styles.costBreakdown}>
              <div className={styles.costItem}>
                <span className={styles.costLabel}>Subtotal</span>
                <span className={styles.costValue}>AED 1,200</span>
              </div>
              <div className={styles.costItem}>
                <span className={styles.costLabel}>Shipping</span>
                <span className={styles.costValue}>FREE</span>
              </div>
              <div className={styles.costItem}>
                <span className={styles.costLabel}>VAT</span>
                <span className={styles.costValue}>AED 50</span>
              </div>
              <div className={styles.costItem}>
                <span className={styles.costLabel}>Discount</span>
                <span className={`${styles.costValue} ${styles.discountValue}`}>- AED 500</span>
              </div>
              <div className={`${styles.costItem} ${styles.totalItem}`}>
                <span className={styles.costLabel}>Order Total</span>
                <span className={styles.totalValue}>AED 700</span>
              </div>
            </div>

            <div className={styles.summaryButtons}>
              <button className={styles.buyAgainButton}>
                Buy Again
              </button>
              <button className={styles.downloadInvoiceButton}>
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;