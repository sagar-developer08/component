'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../../store/slices/profileSlice';
import { createProductReview, clearReviewState } from '../../store/slices/reviewSlice';
import Navigation from '@/components/Navigation';
import styles from './orderHistory.module.css';
import Image from 'next/image';

const OrderHistoryPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const productId = searchParams.get('productId');
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.profile);
  const { loading: reviewLoading, error: reviewError, success: reviewSuccess } = useSelector(state => state.review);
  
  const [rating, setRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    name: '',
    review: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [orderData, setOrderData] = useState(null);

  // Fetch profile data if not already loaded
  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchProfile());
    }
  }, [dispatch, orders]);

  // Find the specific order when orders are loaded
  useEffect(() => {
    if (orders && orders.length > 0 && orderId) {
      const order = orders.find(o => o._id === orderId);
      if (order) {
        if (productId && Array.isArray(order.items)) {
          const filtered = { ...order, items: order.items.filter(it => (it.productId || it.id || '').toString() === productId.toString()) };
          setOrderData(filtered.items.length > 0 ? filtered : order);
        } else {
          setOrderData(order);
        }
      } else {
        console.error('Order not found');
      }
    }
  }, [orders, orderId, productId]);

  // Handle review success
  useEffect(() => {
    if (reviewSuccess) {
      alert('Review submitted successfully!')
      // Reset form
      setReviewData({ name: '', review: '' })
      setRating(0)
      setImageFiles([])
      setImagePreviews([])
      // Clear review state
      setTimeout(() => {
        dispatch(clearReviewState())
      }, 2000)
    }
  }, [reviewSuccess, dispatch])

  // Handle review error
  useEffect(() => {
    if (reviewError) {
      alert(`Error: ${reviewError}`)
      dispatch(clearReviewState())
    }
  }, [reviewError, dispatch])

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
    const files = Array.from(e.target.files || []);
    
    if (files.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed per review');
      return;
    }

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Only image files are allowed');
      return;
    }

    // Add new files to existing files
    setImageFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    // Validate required fields
    if (rating === 0) {
      alert('Please select a rating (1-5 stars)');
      return;
    }

    if (!reviewData.review || reviewData.review.trim().length === 0) {
      alert('Please write a review');
      return;
    }

    // Get the actual product ID from the order items
    const actualProductId = orderData?.items?.[0]?.productId || productId;
    
    if (!actualProductId) {
      alert('Product ID not found');
      return;
    }

    // Dispatch createProductReview action
    await dispatch(createProductReview({
      productId: actualProductId,
      rating: rating,
      name: reviewData.name,
      comment: reviewData.review,
      imageFiles: imageFiles
    }));
  };

  const handleCancelReview = () => {
    setReviewData({ name: '', review: '' });
    setRating(0);
    setImageFiles([]);
    setImagePreviews([]);
    dispatch(clearReviewState());
  };

  // Helper functions for formatting
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      case 'processing':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  // Compute per-item unit price including VAT and Tax
  const getItemUnitPriceWithTaxes = (item, order) => {
    const base = Number(item?.unitPrice ?? item?.price ?? 0) || 0;
    const qty = Math.max(1, Number(item?.quantity) || 1);
    const lineTax = Number(item?.tax) || 0;
    const lineVat = Number(item?.vat) || 0;

    // Prefer item-level tax/vat if provided (assumed totals for the line)
    if (lineTax || lineVat) {
      const perUnitTaxes = (lineTax + lineVat) / qty;
      const inclusive = base + perUnitTaxes;
      return Number(inclusive.toFixed(2));
    }

    // Otherwise compute a tax rate from order totals and apply to the unit price
    const derivedSubtotal = Number(order?.subtotal);
    const fallbackSubtotal = Array.isArray(order?.items)
      ? order.items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0)
      : 0;
    const orderSubtotal = (isNaN(derivedSubtotal) || derivedSubtotal <= 0) ? fallbackSubtotal : derivedSubtotal;
    const orderTax = Number(order?.tax) || 0;
    const orderVat = Number(order?.vat) || 0;

    if (orderSubtotal > 0 && (orderTax || orderVat)) {
      const taxRate = (orderTax + orderVat) / orderSubtotal; // fraction applied to unit price
      const inclusive = base * (1 + taxRate);
      return Number(inclusive.toFixed(2));
    }

    // Fallback: no taxes available
    return Number(base.toFixed(2));
  };

  // Compute subtotal from items' unit prices (excluding taxes), respecting quantity
  const getItemsSubtotal = (order) => {
    if (!order || !Array.isArray(order.items)) return 0;
    const sum = order.items.reduce((acc, it) => {
      const unit = Number(it?.unitPrice ?? it?.price ?? 0) || 0;
      const qty = Math.max(1, Number(it?.quantity) || 1);
      return acc + unit * qty;
    }, 0);
    return Number(sum.toFixed(2));
  };

  // Compute total tax across displayed items (prefer item-level tax, else proportional share from order.tax)
  const getItemsTax = (order) => {
    if (!order || !Array.isArray(order.items)) return 0;
    const orderSubtotal = getItemsSubtotal(order) || 0;
    const orderTax = Number(order?.tax) || 0;
    let sum = 0;
    for (const it of order.items) {
      const qty = Math.max(1, Number(it?.quantity) || 1);
      const unit = Number(it?.unitPrice ?? it?.price ?? 0) || 0;
      const lineBase = unit * qty;
      const lineTax = Number(it?.tax) || 0;
      if (lineTax) {
        sum += lineTax;
      } else if (orderSubtotal > 0 && orderTax) {
        sum += (lineBase / orderSubtotal) * orderTax;
      }
    }
    return Number(sum.toFixed(2));
  };

  // Compute total VAT across displayed items (prefer item-level vat, else proportional share from order.vat)
  const getItemsVat = (order) => {
    if (!order || !Array.isArray(order.items)) return 0;
    const orderSubtotal = getItemsSubtotal(order) || 0;
    const orderVat = Number(order?.vat) || 0;
    let sum = 0;
    for (const it of order.items) {
      const qty = Math.max(1, Number(it?.quantity) || 1);
      const unit = Number(it?.unitPrice ?? it?.price ?? 0) || 0;
      const lineBase = unit * qty;
      const lineVat = Number(it?.vat) || 0;
      if (lineVat) {
        sum += lineVat;
      } else if (orderSubtotal > 0 && orderVat) {
        sum += (lineBase / orderSubtotal) * orderVat;
      }
    }
    return Number(sum.toFixed(2));
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Loading order details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navigation />
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            Error loading order: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div>
        <Navigation />
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Order not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 className={styles.orderNumber}>ORDER #{orderData.orderNumber}</h1>
      </div>

      {/* Order Information Card */}
      <div className={styles.orderInfoCard}>
        <div className={styles.orderInfoLeft}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Order Placed</span>
            <span className={styles.infoValue}>{formatDate(orderData.createdAt)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Order Number</span>
            <span className={styles.infoValue}>{orderData.orderNumber}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Payment Method</span>
            <span className={styles.infoValue}>{orderData.paymentMethod || 'Credit/Debit Card'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Order Status</span>
            <span 
              className={`${styles.infoValue} ${styles.deliveredStatus}`}
              style={{ color: getStatusColor(orderData.status) }}
            >
              {orderData.status}
            </span>
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
                {orderData.deliveryAddress && orderData.deliveryAddress.addressLine1 !== "Address not provided" ? 
                  `${orderData.deliveryAddress.fullName || ''}\n${orderData.deliveryAddress.addressLine1}, ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} ${orderData.deliveryAddress.postalCode}, ${orderData.deliveryAddress.country}` :
                  'Delivery address not provided'
                }
              </p>
              <div className={styles.contactInfo}>
                <span className={styles.contactNumber}>
                  {orderData.deliveryAddress?.phone && orderData.deliveryAddress.phone !== "+1234567890" ? 
                    orderData.deliveryAddress.phone : 'Phone not provided'}
                </span>
                <span className={styles.contactEmail}>
                  {orderData.deliveryAddress?.email || 'Email not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className={styles.addressCard}>
            <h3 className={styles.cardTitle}>Shipping Address</h3>
            <div className={styles.addressContent}>
              <span className={styles.addressType}>Home</span>
              <p className={styles.addressText}>
                {orderData.shippingAddress && orderData.shippingAddress.addressLine1 !== "Address not provided" ? 
                  `${orderData.shippingAddress.fullName || ''}\n${orderData.shippingAddress.addressLine1}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}, ${orderData.shippingAddress.country}` :
                  'Shipping address not provided'
                }
              </p>
              <div className={styles.contactInfo}>
                <span className={styles.contactNumber}>
                  {orderData.shippingAddress?.phone && orderData.shippingAddress.phone !== "+1234567890" ? 
                    orderData.shippingAddress.phone : 'Phone not provided'}
                </span>
                <span className={styles.contactEmail}>
                  {orderData.shippingAddress?.email || 'Email not provided'}
                </span>
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
                  onClick={() => imageFiles.length < 5 && document.getElementById('photo-upload').click()}
                  style={{ cursor: imageFiles.length < 5 ? 'pointer' : 'not-allowed' }}
                >
                  <input
                    type="file"
                    id="photo-upload"
                    name="photo"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <input
                    type="text"
                    value={imageFiles.length > 0 ? `${imageFiles.length} image(s) selected` : ''}
                    className={styles.formInput}
                    placeholder="Choose file (max 5 images)"
                    readOnly
                    style={{ cursor: imageFiles.length < 5 ? 'pointer' : 'not-allowed' }}
                  />
                  <button 
                    type="button"
                    className={styles.uploadButton}
                    style={{ cursor: imageFiles.length < 5 ? 'pointer' : 'not-allowed' }}
                    disabled={imageFiles.length >= 5}
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
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className={styles.imagePreviews}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className={styles.imagePreviewItem}>
                        <img src={preview} alt={`Preview ${index + 1}`} className={styles.previewImage} />
                        <button
                          type="button"
                          className={styles.removeImageButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCancelReview}
                  disabled={reviewLoading}
                >
                  Cancel
                </button>
                <button 
                  className={styles.submitButton} 
                  onClick={handleSubmitReview}
                  disabled={reviewLoading || rating === 0}
                >
                  {reviewLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className={styles.orderSummaryCard}>
            <h3 className={styles.cardTitle}>Order Summary</h3>
            
            {/* Order Items */}
            {orderData.items && orderData.items.map((item, index) => (
              <div key={index} className={styles.productSection}>
                <div className={styles.productImage}>
                  <Image
                    src="/iphone.jpg"
                    alt={item.name}
                    width={60}
                    height={60}
                    className={styles.productImg}
                  />
                </div>
                <div className={styles.productDetails}>
                  <h6 className={styles.productBrand}>Product</h6>
                  <h4 className={styles.productName}>{item.name}</h4>
                  <p className={styles.productQuantity}>Qty: {item.quantity}</p>
                  <p className={styles.productPrice}>{'AED'} {(Number(item?.unitPrice ?? item?.price ?? 0)).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className={styles.costBreakdown}>
              <div className={styles.costItem}>
                <span className={styles.costLabel}>Subtotal</span>
                <span className={styles.costValue}>{'AED'} {getItemsSubtotal(orderData)}</span>
              </div>
              <div className={styles.costItem}>
                <span className={styles.costLabel}>Shipping</span>
                <span className={styles.costValue}>
                  {orderData.shippingCost === 0 ? 'FREE' : `${'AED'} ${orderData.shippingCost}`}
                </span>
              </div>
              {getItemsTax(orderData) > 0 && (
                <div className={styles.costItem}>
                  <span className={styles.costLabel}>Tax</span>
                  <span className={styles.costValue}>{'AED'} {getItemsTax(orderData)}</span>
                </div>
              )}
              {getItemsVat(orderData) > 0 && (
                <div className={styles.costItem}>
                  <span className={styles.costLabel}>VAT</span>
                  <span className={styles.costValue}>{'AED'} {getItemsVat(orderData)}</span>
                </div>
              )}
              {orderData.discount && orderData.discount > 0 && (
                <div className={styles.costItem}>
                  <span className={styles.costLabel}>Discount</span>
                  <span className={`${styles.costValue} ${styles.discountValue}`}>
                    - {orderData.currency} {Number(orderData.discount).toFixed(2)}
                  </span>
                </div>
              )}
              <div className={`${styles.costItem} ${styles.totalItem}`}>
                <span className={styles.costLabel}>Order Total</span>
                <span className={styles.totalValue}>{'AED'} {Number(getItemsSubtotal(orderData) + getItemsTax(orderData) + getItemsVat(orderData)).toFixed(2)}</span>
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