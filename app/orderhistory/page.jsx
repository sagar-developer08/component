'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../../store/slices/profileSlice';
import { createProductReview, updateProductReview, clearReviewState } from '../../store/slices/reviewSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { getAuthToken, getUserFromCookies } from '../../utils/userUtils';
import { useToast } from '../../contexts/ToastContext';
import Navigation from '@/components/Navigation';
import styles from './orderHistory.module.css';
import Image from 'next/image';

const OrderHistoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const productId = searchParams.get('productId');
  const dispatch = useDispatch();
  const { orders, ordersLoading, error } = useSelector(state => state.profile);
  const { loading: reviewLoading, error: reviewError, success: reviewSuccess, reviews } = useSelector(state => state.review);
  const { show: showToast } = useToast();
  
  const [rating, setRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    name: '',
    review: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [lastSubmittedHasImages, setLastSubmittedHasImages] = useState(false);

  // Fetch orders data if not already loaded
  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchOrders());
    }
  }, [dispatch, orders]);

  // Fetch existing review for this product
  useEffect(() => {
    const checkExistingReview = async () => {
      try {
        // Use productId field directly as specified
        const firstItem = orderData?.items?.[0];
        const actualProductId = firstItem?.productId || productId;
        
        if (!actualProductId) {
          console.log('⚠️ No valid product ID found');
          return;
        }

        console.log('🔍 Checking for existing review for product:', actualProductId);

        // Get auth token to identify current user
        const token = await getAuthToken();
        let foundReview = null;
        
        if (token) {
          try {
            // Get MongoDB user ID from encrypted cookies (this is the correct way)
            const mongoUserId = await getUserFromCookies();
            console.log('🔍 Looking for review with MongoDB user ID:', mongoUserId);
            
            if (mongoUserId) {
              // Call the API using POST method with body parameters
              const response = await fetch(`https://backendreview.qliq.ae/api/product-reviews/user/product-reviews`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId: mongoUserId,
                  productId: actualProductId,
                  orderId: orderId || undefined
                })
              });
              const data = await response.json();
              
              console.log('📝 User product reviews response:', data);
              
              if (data.success && data.data && data.data.reviews && Array.isArray(data.data.reviews)) {
                // The API now returns only the user's reviews for this product
                foundReview = data.data.reviews.length > 0 ? data.data.reviews[0] : null;
                console.log('🔍 Found review by MongoDB ID:', foundReview ? 'YES' : 'NO');
              }
            }
            
            // If no review found with MongoDB user ID, try JWT token sub
            if (!foundReview) {
              const tokenParts = token.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                const currentUserId = payload.sub;
                console.log('🔍 Trying JWT sub:', currentUserId);
                
                // Try the API again with JWT sub as userId
                const response = await fetch(`https://backendreview.qliq.ae/api/product-reviews/user/product-reviews`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    userId: currentUserId,
                    productId: actualProductId,
                    orderId: orderId || undefined
                  })
                });
                const data = await response.json();
                
                if (data.success && data.data && data.data.reviews && Array.isArray(data.data.reviews)) {
                  foundReview = data.data.reviews.length > 0 ? data.data.reviews[0] : null;
                  console.log('🔍 Found review by JWT sub:', foundReview ? 'YES' : 'NO');
                }
              }
            }
          } catch (error) {
            console.error('❌ Error getting user review:', error);
          }
        } else {
          console.log('⚠️ No auth token available');
        }
        
        if (foundReview) {
          console.log('✅ Found existing review:', foundReview);
          
          // Map the review data to match our expected structure
          const mappedReview = {
            id: foundReview.id,
            _id: foundReview.id, // Add _id for compatibility
            userId: foundReview.userId,
            productId: foundReview.productId,
            rating: foundReview.rating,
            title: foundReview.title,
            comment: foundReview.comment,
            images: foundReview.images || [],
            pros: foundReview.pros || [],
            cons: foundReview.cons || [],
            isVerified: foundReview.isVerified || false,
            isHelpful: foundReview.isHelpful || 0,
            status: foundReview.status || 'pending',
            createdAt: foundReview.createdAt,
            updatedAt: foundReview.updatedAt
          };
          
          setExistingReview(mappedReview);
          setIsEditMode(true);
          setShowEditForm(false); // Show view mode first
          
          // Populate form data (but don't show form yet)
          setRating(mappedReview.rating);
          setReviewData({
            name: mappedReview.title || '',
            review: mappedReview.comment || ''
          });
          
          if (mappedReview.images && mappedReview.images.length > 0) {
            setImagePreviews(mappedReview.images);
          }
          
          console.log('📋 Review data loaded - showing review with edit button');
        } else {
          console.log('ℹ️ No existing review found for this product');
          setExistingReview(null);
          setIsEditMode(false);
          setShowEditForm(true); // Show form to create new review
        }
      } catch (err) {
        console.error('❌ Error checking for existing review:', err);
        setShowEditForm(true); // On error, show form
      }
    };

    if (orderData) {
      checkExistingReview();
    }
  }, [orderData, productId]);

  // Find the specific order when orders are loaded
  useEffect(() => {
    if (orders && orders.length > 0 && orderId) {
      const order = orders.find(o => o._id === orderId);
      if (order) {
        console.log('Found order:', order);
        console.log('Order items:', order.items);
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
      // Check if we're in edit mode to show appropriate message
      if (isEditMode) {
        // Message for update is handled in handleSubmitReview where we have image context
        // This is a fallback in case the update message wasn't shown
        if (!lastSubmittedHasImages) {
          showToast('Review updated successfully (no images)', 'success')
        }
      } else {
        // For new reviews, show message based on whether images were included
        if (lastSubmittedHasImages) {
          showToast('Review submitted successfully with images!', 'success')
        } else {
          showToast('Review submitted successfully (without images)', 'success')
        }
        // After successful creation, refresh to check for existing review
        setReviewData({ name: '', review: '' })
        setRating(0)
        setImageFiles([])
        setImagePreviews([])
        setShowEditForm(false)
        // Reload the page to fetch the newly created review
        window.location.reload()
      }
      // Clear review state
      setTimeout(() => {
        dispatch(clearReviewState())
      }, 2000)
    }
  }, [reviewSuccess, dispatch, showToast, isEditMode, lastSubmittedHasImages])

  // Handle review error
  useEffect(() => {
    if (reviewError) {
      showToast(`Error: ${reviewError}`, 'error')
      dispatch(clearReviewState())
    }
  }, [reviewError, dispatch, showToast])

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
    
    // Count existing images (URLs) and new files
    const existingImageCount = imagePreviews.filter(img => typeof img === 'string' && img.startsWith('http')).length;
    
    if (files.length + imageFiles.length + existingImageCount > 5) {
      showToast('Maximum 5 images allowed per review', 'error');
      return;
    }

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      showToast('Only image files are allowed', 'error');
      return;
    }

    if (validFiles.length === 0) {
      return;
    }

    // Add new files to existing files
    setImageFiles(prev => [...prev, ...validFiles]);

    // Create previews
    let loadedCount = 0;
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
        loadedCount++;
        // Show success message when all images are loaded
        if (loadedCount === validFiles.length) {
          if (validFiles.length === 1) {
            showToast('Image added successfully', 'success');
          } else {
            showToast(`${validFiles.length} images added successfully`, 'success');
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    // Check if this is an existing review image (URL) or new upload (File)
    const isExistingImage = typeof imagePreviews[index] === 'string' && imagePreviews[index].startsWith('http');
    
    if (isExistingImage && isEditMode) {
      // Remove from existing review images
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      showToast('Image removed. Changes will be saved when you update the review.', 'success');
      // Note: The existing images will be updated when form is submitted
    } else {
      // Remove from new uploads
      // Calculate the correct index for new files (excluding existing images)
      const existingImageCount = imagePreviews.filter(img => typeof img === 'string' && img.startsWith('http')).length;
      const newFileIndex = index - existingImageCount;
      
      if (newFileIndex >= 0) {
        setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
      }
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      showToast('Image removed successfully', 'success');
    }
  };

  const handleSubmitReview = async () => {
    // Validate required fields
    if (rating === 0) {
      showToast('Please select a rating (1-5 stars)', 'error');
      return;
    }

    if (!reviewData.review || reviewData.review.trim().length === 0) {
      showToast('Please write a review', 'error');
      return;
    }

    // Check if review has images
    const hasImages = imageFiles.length > 0 || imagePreviews.length > 0;
    setLastSubmittedHasImages(hasImages);

    // Use productId field directly as specified
    const firstItem = orderData?.items?.[0];
    const actualProductId = firstItem?.productId || productId;
    
    if (!actualProductId) {
      showToast('Product MongoDB ID not found. Please contact support.', 'error');
      console.error('Available product data:', firstItem);
      return;
    }

    console.log(isEditMode ? 'Updating review' : 'Creating review', 'with product ID:', actualProductId);

    if (isEditMode && existingReview) {
      // Update existing review using Redux action
      try {
        // Get existing image URLs from previews
        const existingImageUrls = imagePreviews.filter(url => typeof url === 'string' && url.startsWith('http'));
        
        // Check if images were added, removed, or updated
        const originalImageCount = existingReview.images ? existingReview.images.length : 0;
        const currentImageCount = existingImageUrls.length + imageFiles.length;
        const imagesChanged = originalImageCount !== currentImageCount || imageFiles.length > 0;
        
        const result = await dispatch(updateProductReview({
          reviewId: existingReview.id || existingReview._id,
          rating: rating,
          title: reviewData.name,
          comment: reviewData.review,
          images: existingImageUrls,
          imageFiles: imageFiles
        }));

        if (updateProductReview.fulfilled.match(result)) {
          // Show appropriate message based on image changes
          if (imagesChanged) {
            if (imageFiles.length > 0 && existingImageUrls.length > 0) {
              showToast('Review and images updated successfully!', 'success');
            } else if (imageFiles.length > 0) {
              showToast('Review updated with new images!', 'success');
            } else if (currentImageCount < originalImageCount) {
              showToast('Review updated. Images removed successfully!', 'success');
            } else {
              showToast('Review updated successfully!', 'success');
            }
          } else {
            // Images didn't change
            if (!hasImages) {
              showToast('Review updated successfully (no images)', 'success');
            } else {
              showToast('Review updated successfully!', 'success');
            }
          }
          
          // Update the existing review state with new data
          setExistingReview({
            ...existingReview,
            rating: rating,
            title: reviewData.name,
            comment: reviewData.review,
            images: result.payload.images || existingImageUrls,
            updatedAt: new Date().toISOString()
          });
          // Clear new file uploads
          setImageFiles([]);
          // Keep the updated image previews
          setImagePreviews(result.payload.images || existingImageUrls);
          // Go back to view mode
          setShowEditForm(false);
        } else {
          throw new Error(result.payload || 'Failed to update review');
        }
      } catch (err) {
        showToast(`Error updating review: ${err.message}`, 'error');
      }
    } else {
      // Create new review
      await dispatch(createProductReview({
        productId: actualProductId,
        rating: rating,
        name: reviewData.name,
        comment: reviewData.review,
        imageFiles: imageFiles,
        orderId: orderId // Include orderId when creating review
      }));
    }
  };

  const handleEditClick = () => {
    if (existingReview) {
      // Populate form with existing review data
      setRating(existingReview.rating);
      setReviewData({
        name: existingReview.title || '',
        review: existingReview.comment || ''
      });
      
      // Set existing images as previews
      if (existingReview.images && existingReview.images.length > 0) {
        setImagePreviews(existingReview.images);
      } else {
        setImagePreviews([]);
      }
      
      // Clear any new file uploads
      setImageFiles([]);
    }
    setShowEditForm(true);
  };

  const handleCancelEdit = () => {
    if (existingReview) {
      // Cancel edit, go back to view mode
      setShowEditForm(false);
      // Restore original review data
      setRating(existingReview.rating);
      setReviewData({
        name: existingReview.title || '',
        review: existingReview.comment || ''
      });
      setImageFiles([]);
      setImagePreviews(existingReview.images || []);
    } else {
      // Clear everything
      setReviewData({ name: '', review: '' });
      setRating(0);
      setImageFiles([]);
      setImagePreviews([]);
    }
    dispatch(clearReviewState());
  };

  const handleCancelReview = handleCancelEdit;

  const handleBuyAgain = async () => {
    try {
      // Get the first item from the order (or the specific product if filtered)
      const item = orderData?.items?.[0];
      
      if (!item) {
        showToast('No product found to add to cart', 'error');
        return;
      }

      // Get user ID for cart operations
      const userId = await getUserFromCookies();
      if (!userId) {
        showToast('Please login to add items to cart', 'error');
        return;
      }

      // Prepare cart item data
      const cartItem = {
        productId: item.productId,
        name: item.name,
        price: item.price || item.unitPrice,
        quantity: item.quantity,
        image: item.image || '/iphone.jpg', // fallback image
        brand: item.brand || 'Product'
      };

      console.log('Adding to cart:', cartItem);

      // Add to cart
      const result = await dispatch(addToCart({
        userId,
        productId: cartItem.productId,
        name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
        image: cartItem.image,
        brand: cartItem.brand
      }));

      if (addToCart.fulfilled.match(result)) {
        showToast('Item added to cart successfully!', 'success');
        // Navigate to checkout page
        window.location.href = '/checkout';
      } else {
        showToast('Failed to add item to cart. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Error adding item to cart. Please try again.', 'error');
    }
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

  // Compute discounted subtotal (subtotal after all discounts)
  const getDiscountedSubtotal = (order) => {
    if (!order) return 0;
    const subtotal = getItemsSubtotal(order) || 0;
    const couponDiscount = Number(order?.couponDiscountAmount || 0);
    const qoynsDiscount = Number(order?.qoynsDiscountAmount || 0);
    const otherDiscount = Number(order?.discount || 0);
    
    // Calculate total discount (only count qoyns and coupon, not other discount if they exist)
    let totalDiscount = 0;
    if (couponDiscount > 0) totalDiscount += couponDiscount;
    if (qoynsDiscount > 0) totalDiscount += qoynsDiscount;
    if (otherDiscount > 0 && couponDiscount === 0 && qoynsDiscount === 0) {
      totalDiscount += otherDiscount;
    }
    
    const discountedSubtotal = subtotal - totalDiscount;
    return Math.max(0, discountedSubtotal); // Ensure it doesn't go negative
  };

  // Compute total VAT across displayed items - VAT should be calculated on discounted amount at 5%
  const getItemsVat = (order) => {
    if (!order || !Array.isArray(order.items)) return 0;
    
    const discountedSubtotal = getDiscountedSubtotal(order);
    
    // Always use 5% VAT rate
    const vatRate = 0.05;
    
    // Calculate VAT on discounted subtotal (matching checkout logic)
    const vatAmount = discountedSubtotal * vatRate;
    return Number(vatAmount.toFixed(2));
  };

  if (ordersLoading) {
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
        <button className={styles.backButton} onClick={() => router.back()}>
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
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
                <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Shipping Cost: </span>
                <span style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>AED 9.00</span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          {/* <div className={styles.addressCard}>
            <h3 className={styles.cardTitle}>Billing Address</h3>
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
          </div> */}
        </div>

        {/* Bottom Row - Review and Order Summary */}
        <div className={styles.bottomRow}>
          {/* Write/Edit a Review Card */}
          <div className={styles.reviewCard}>
            {/* Show Review View if exists and not in edit mode */}
            {existingReview && !showEditForm ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className={styles.cardTitle}>Your Review</h3>
                  <button 
                    className={styles.editButton}
                    onClick={handleEditClick}
                    style={{ 
                      padding: '12px 24px', 
                      background: ' rgb(0, 130, 255, 0.2)', 
                      color: 'rgb(0, 130, 255)', 
                      border: '1px solid rgb(0, 130, 255)', 
                      borderRadius: '25px', 
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}
                  >
                    Edit Review
                  </button>
                </div>
                
                {/* Display existing review */}
                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                  {/* Rating */}
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '14px', color: '#666', marginBottom: '8px', display: 'block' }}>Rating</label>
                    <div className={styles.starRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} width="24" height="24" viewBox="0 0 24 24" fill={star <= existingReview.rating ? '#FFB800' : '#E0E0E0'}>
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Name/Title */}
                  {existingReview.title && (
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '14px', color: '#666', marginBottom: '8px', display: 'block' }}>Name</label>
                      <div style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '500' }}>{existingReview.title}</div>
                    </div>
                  )}

                  {/* Comment */}
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '14px', color: '#666', marginBottom: '8px', display: 'block' }}>Review</label>
                    <div style={{ fontSize: '15px', color: '#333', lineHeight: '1.6' }}>{existingReview.comment}</div>
                  </div>

                  {/* Images */}
                  {existingReview.images && existingReview.images.length > 0 && (
                    <div>
                      <label style={{ fontSize: '14px', color: '#666', marginBottom: '8px', display: 'block' }}>Photos</label>
                      <div className={styles.imagePreviews}>
                        {existingReview.images.map((imageUrl, index) => (
                          <div key={index} className={styles.imagePreviewItem}>
                            <img src={imageUrl} alt={`Review ${index + 1}`} className={styles.previewImage} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #dee2e6' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      color: existingReview.status === 'approved' ? '#4CAF50' : existingReview.status === 'pending' ? '#FF9800' : '#F44336',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      Status: {existingReview.status}
                    </span>
                    <span style={{ fontSize: '12px', color: '#999', marginLeft: '15px' }}>
                      {formatDate(existingReview.createdAt)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                 <h3 className={styles.cardTitle}>
                   {isEditMode ? 'Edit Your Review' : 'Write a review'}
                 </h3>
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
                  onClick={() => {
                    const existingImageCount = imagePreviews.filter(img => typeof img === 'string' && img.startsWith('http')).length;
                    const totalImages = imageFiles.length + existingImageCount;
                    if (totalImages < 5) {
                      document.getElementById('photo-upload').click();
                    }
                  }}
                  style={{ 
                    cursor: (() => {
                      const existingImageCount = imagePreviews.filter(img => typeof img === 'string' && img.startsWith('http')).length;
                      const totalImages = imageFiles.length + existingImageCount;
                      return totalImages < 5 ? 'pointer' : 'not-allowed';
                    })()
                  }}
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
                    value={(() => {
                      const existingImageCount = imagePreviews.filter(img => typeof img === 'string' && img.startsWith('http')).length;
                      const totalImages = imageFiles.length + existingImageCount;
                      if (totalImages > 0) {
                        return `${totalImages} image(s) selected (${existingImageCount} existing, ${imageFiles.length} new)`;
                      }
                      return '';
                    })()}
                    className={styles.formInput}
                    placeholder="Choose file (max 5 images)"
                    readOnly
                    style={{ 
                      cursor: (() => {
                        const existingImageCount = imagePreviews.filter(img => typeof img === 'string' && img.startsWith('http')).length;
                        const totalImages = imageFiles.length + existingImageCount;
                        return totalImages < 5 ? 'pointer' : 'not-allowed';
                      })()
                    }}
                  />
                  <button 
                    type="button"
                    className={styles.uploadButton}
                    style={{ 
                      cursor: (() => {
                        const existingImageCount = imagePreviews.filter(img => typeof img === 'string' && img.startsWith('http')).length;
                        const totalImages = imageFiles.length + existingImageCount;
                        return totalImages < 5 ? 'pointer' : 'not-allowed';
                      })()
                    }}
                    disabled={(() => {
                      const existingImageCount = imagePreviews.filter(img => typeof img === 'string' && img.startsWith('http')).length;
                      const totalImages = imageFiles.length + existingImageCount;
                      return totalImages >= 5;
                    })()}
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
                    {imagePreviews.map((preview, index) => {
                      const isExistingImage = typeof preview === 'string' && preview.startsWith('http');
                      return (
                        <div key={index} className={styles.imagePreviewItem}>
                          <img src={preview} alt={`Preview ${index + 1}`} className={styles.previewImage} />
                          {isExistingImage && (
                            <span className={styles.existingImageBadge}>Existing</span>
                          )}
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
                      );
                    })}
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
                  {isEditMode ? 'Back' : 'Cancel'}
                </button>
                <button 
                  className={styles.submitButton} 
                  onClick={handleSubmitReview}
                  disabled={reviewLoading || rating === 0}
                >
                  {reviewLoading ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update' : 'Submit')}
                </button>
              </div>
            </div>
              </>
            )}
          </div>

          {/* Order Summary Card */}
          <div className={styles.orderSummaryCard}>
            <h3 className={styles.cardTitle}>Order Summary</h3>
            
            {/* Order Items */}
            {orderData.items && orderData.items.map((item, index) => (
              <div key={index} className={styles.productSection}>
                <div className={styles.productImage}>
                  <Image
                    src={item.image || '/iphone.jpg'}
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
                <span className={styles.costValue}>{'AED'} {getItemsSubtotal(orderData).toFixed(2)}</span>
              </div>
              {/* Discount Breakdown - shown before VAT */}
              {((orderData.couponDiscountAmount && Number(orderData.couponDiscountAmount) > 0) || 
                (orderData.qoynsDiscountAmount && Number(orderData.qoynsDiscountAmount) > 0) || 
                (orderData.discount !== undefined && orderData.discount !== null && Number(orderData.discount) > 0)) && (
                <>
                  {/* {orderData.couponDiscountAmount && Number(orderData.couponDiscountAmount) > 0 && (
                    <div className={styles.costItem}>
                      <span className={styles.costLabel}>
                        Coupon Discount {orderData.couponCode ? `(${orderData.couponCode})` : ''}
                        {orderData.couponDiscountPercentage ? ` - ${orderData.couponDiscountPercentage}%` : ''}
                      </span>
                      <span className={styles.costValue} style={{ color: '#4CAF50' }}>
                        - {"AED"} {Number(orderData.couponDiscountAmount).toFixed(2)}
                      </span>
                    </div>
                  )} */}
                  {orderData.qoynsDiscountAmount && Number(orderData.qoynsDiscountAmount) > 0 && (
                    <div className={styles.costItem}>
                      <span className={styles.costLabel}>
                        Qoyns Discount {orderData.qoynsUsed && Number(orderData.qoynsUsed) > 0 ? `(${Number(orderData.qoynsUsed).toLocaleString()} Qoyns)` : ''}
                      </span>
                      <span className={styles.costValue} style={{ color: '#4CAF50' }}>
                        - {"AED"} {Number(orderData.qoynsDiscountAmount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {orderData.discount !== undefined && orderData.discount !== null && Number(orderData.discount) > 0 && 
                   !((orderData.couponDiscountAmount && Number(orderData.couponDiscountAmount) > 0) || 
                     (orderData.qoynsDiscountAmount && Number(orderData.qoynsDiscountAmount) > 0)) && (
                    <div className={styles.costItem}>
                      <span className={styles.costLabel}>Discount</span>
                      <span className={styles.costValue} style={{ color: '#4CAF50' }}>
                        - {"AED"} {Number(orderData.discount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className={styles.costItem}>
                    <span className={styles.costLabel}>Subtotal after discount</span>
                    <span className={styles.costValue}>{'AED'} {getDiscountedSubtotal(orderData).toFixed(2)}</span>
                  </div>
                </>
              )}
              {getItemsVat(orderData) > 0 && (
                <div className={styles.costItem}>
                  <span className={styles.costLabel}>VAT (5%)</span>
                  <span className={styles.costValue}>{'AED'} {getItemsVat(orderData).toFixed(2)}</span>
                </div>
              )}
              <div className={styles.costItem}>
                <span className={styles.costLabel}>Shipping</span>
                <span className={styles.costValue}>
                  AED 9.00
                </span>
              </div>
              {/* {getItemsTax(orderData) > 0 && (
                <div className={styles.costItem}>
                  <span className={styles.costLabel}>Tax</span>
                  <span className={styles.costValue}>{'AED'} {getItemsTax(orderData)}</span>
                </div>
              )} */}
              <div className={`${styles.costItem} ${styles.totalItem}`}>
                <span className={styles.costLabel}>Order Total</span>
                <span className={styles.totalValue}>
                  {'AED'} {orderData.totalAmount ? (Number(orderData.totalAmount)).toFixed(2) : 
                    Number(
                      getDiscountedSubtotal(orderData) + 
                      getItemsVat(orderData) + 
                      9
                    ).toFixed(2)
                  }
                </span>
              </div>
            </div>

            <div className={styles.summaryButtons}>
              <button 
                className={styles.buyAgainButton}
                onClick={handleBuyAgain}
              >
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
