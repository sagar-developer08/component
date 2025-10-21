import ProductCard from '@/components/ProductCard'
import SectionHeader from '@/components/SectionHeader'
import ProductInformation from '@/components/productDetailPage/ProductInformation'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProductReviews } from '@/store/slices/reviewSlice'

export default function ProductSections({ relatedProducts, productData }) {
  const [expandedItem, setExpandedItem] = useState(0)
  const [manufacturerImageIndex, setManufacturerImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState('')
  const [lightboxReview, setLightboxReview] = useState(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [viewAllOpen, setViewAllOpen] = useState(false)
  
  // Redux for reviews
  const dispatch = useDispatch()
  const { reviews, loading: reviewsLoading } = useSelector(state => state.review)
  
  // Fetch reviews when component mounts
  useEffect(() => {
    if (productData?._id) {
      dispatch(getProductReviews(productData._id))
    }
  }, [productData?._id, dispatch])

  // Image lightbox handlers
  const openLightbox = (imageUrl, review = null) => {
    setLightboxImage(imageUrl)
    setLightboxReview(review)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxImage('')
    setLightboxReview(null)
  }

  // Gallery handlers
  const openGallery = (index = 0) => {
    setCurrentGalleryIndex(index)
    setGalleryOpen(true)
    setViewAllOpen(false) // Close view all when opening gallery
  }

  const closeGallery = () => {
    setGalleryOpen(false)
    setCurrentGalleryIndex(0)
  }

  const nextGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % reviewImages.length)
  }

  const prevGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + reviewImages.length) % reviewImages.length)
  }

  // View All handlers
  const openViewAll = () => {
    setViewAllOpen(true)
  }

  const closeViewAll = () => {
    setViewAllOpen(false)
  }

  const openImageFromViewAll = (index) => {
    setViewAllOpen(false)
    openGallery(index)
  }

  // Calculate review statistics
  const calculateReviewStats = () => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let totalRating = 0

    reviews.forEach(review => {
      const rating = review.rating || 0
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++
        totalRating += rating
      }
    })

    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0
    
    const percentages = {}
    Object.keys(distribution).forEach(rating => {
      percentages[rating] = totalReviews > 0 
        ? Math.round((distribution[rating] / totalReviews) * 100) 
        : 0
    })

    return { averageRating, totalReviews, ratingDistribution: distribution, percentages }
  }

  const reviewStats = calculateReviewStats()

  // Get all review images with associated review data
  const getAllReviewImages = () => {
    if (!reviews || !Array.isArray(reviews)) return []
    const imagesWithReviews = []
    reviews.forEach(review => {
      if (review.images && review.images.length > 0) {
        review.images.forEach(imageUrl => {
          imagesWithReviews.push({ imageUrl, review })
        })
      }
    })
    return imagesWithReviews
  }

  const reviewImagesData = getAllReviewImages()
  const reviewImages = reviewImagesData.map(item => item.imageUrl)

  // Format date helper
  const formatReviewDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Normalize relatedProducts to always be an array
  const relatedList = Array.isArray(relatedProducts)
    ? relatedProducts
    : (Array.isArray(relatedProducts?.data?.products) ? relatedProducts.data.products
      : Array.isArray(relatedProducts?.data?.items) ? relatedProducts.data.items
        : Array.isArray(relatedProducts?.data) ? relatedProducts.data
          : Array.isArray(relatedProducts?.items) ? relatedProducts.items
            : [])

  const toggleAccordion = (index) => {
    setExpandedItem(expandedItem === index ? -1 : index)
  }

  // Sample manufacturer images
  const manufacturerImages = [
    "/6.jpeg",
    "/2.jpg",
    "/1.jpg"
  ]

  const nextImage = () => {
    setManufacturerImageIndex((prevIndex) =>
      prevIndex === manufacturerImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setManufacturerImageIndex((prevIndex) =>
      prevIndex === 0 ? manufacturerImages.length - 1 : prevIndex - 1
    )
  }

  // Create comprehensive specifications from API data
  const createSpecifications = () => {
    if (!productData) return []

    const specs = []

    // Add specifications from API
    if (productData.specifications) {
      Object.entries(productData.specifications).forEach(([key, value]) => {
        // Convert value to string if it's an object or array
        let displayValue = value
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            displayValue = value.join(', ')
          } else {
            displayValue = JSON.stringify(value)
          }
        }

        specs.push({
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: displayValue
        })
      })
    }

    // Add category information
    if (productData.level4?.name) {
      specs.push({ label: 'Category', value: productData.level4.name })
    }
    if (productData.level3?.name) {
      specs.push({ label: 'Sub Category', value: productData.level3.name })
    }

    // Add brand information
    if (productData.brand_id?.name) {
      specs.push({ label: 'Brand', value: productData.brand_id.name })
    }

    // Add weight and dimensions
    if (productData.weight) {
      specs.push({ label: 'Weight', value: `${productData.weight}kg` })
    }
    if (productData.attributes?.dimensions) {
      const { length, width, height } = productData.attributes.dimensions
      specs.push({ label: 'Dimensions', value: `${length} x ${width} x ${height} cm` })
    }

    // Add SKU
    if (productData.sku) {
      specs.push({ label: 'SKU', value: productData.sku })
    }

    return specs
  }

  // Create comprehensive attributes from API data
  const createAttributes = () => {
    if (!productData) return []

    const attrs = []

    // Add attributes from API
    if (productData.attributes) {
      Object.entries(productData.attributes).forEach(([key, value]) => {
        // Skip dimensions as it's handled separately
        if (key === 'dimensions') return

        // Convert value to string if it's an object or array
        let displayValue = value
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            displayValue = value.join(', ')
          } else {
            displayValue = JSON.stringify(value)
          }
        }

        attrs.push({
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: displayValue
        })
      })
    }

    // Add warranty information
    if (productData.attributes?.warranty_period && productData.attributes?.warranty_type) {
      attrs.push({ label: 'Warranty', value: `${productData.attributes.warranty_period} months (${productData.attributes.warranty_type})` })
    }

    // Add store information
    if (productData.store_id?.name) {
      attrs.push({ label: 'Store', value: productData.store_id.name })
    }

    // Add status information
    if (productData.status) {
      attrs.push({ label: 'Status', value: productData.status.charAt(0).toUpperCase() + productData.status.slice(1) })
    }

    // Add product flags
    const flags = []
    if (productData.is_featured) flags.push('Featured')
    if (productData.is_best_seller) flags.push('Best Seller')
    if (productData.is_offer) flags.push('On Offer')
    if (productData.special_deals_for_qliq_plus) flags.push('Qliq Plus Deal')

    if (flags.length > 0) {
      attrs.push({ label: 'Product Flags', value: flags.join(', ') })
    }

    // Add tags
    if (productData.tags && productData.tags.length > 0) {
      attrs.push({ label: 'Tags', value: productData.tags.join(', ') })
    }

    return attrs
  }

  const specifications = createSpecifications()
  const attributes = createAttributes()

  return (
    <div className="product-sections">
      {/* Related Products Section */}
      <section className="related-products-section">
        <div className="section-header">
          <h2 className="section-title">Related Products</h2>
          <a href="#" className="see-all-link">See All</a>
        </div>
        <div className="products-carousel">
          {Array.isArray(relatedList) && relatedList.length > 0 ? relatedList.slice(0, 4).map((product, index) => (
            <div key={product.id || `product-${index}`} className="product-card">
              <div className="product-badge">QLIQ's Choice</div>
              <div className="product-image-container">
                <img src={product.image || '/shoes.jpg'} alt={product.title} className="product-image" />
                <div className="product-actions">
                  <button className="action-btn heart-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#0082FF"/>
                    </svg>
                  </button>
                  <button className="action-btn cart-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="#0082FF"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.price}</div>
              </div>
            </div>
          )) : (
            <div className="no-products">No related products available</div>
          )}
        </div>
      </section>

      {/* Product Information Section */}
      {/* <ProductInformation /> */}

      {/* Product Overview Section */}
      <section className="product-overview-section">
        <h2 className="section-title">Product Overview</h2>
        <div className="overview-content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
        </div>
      </section>

      {/* Product Specifications Section */}
      <section className="product-specifications-section">
        <h2 className="section-title">Product Specifications</h2>
        <div className="specifications-list">
          <div className="spec-item">
            <span className="spec-label">Heading</span>
            <span className="spec-value">Lorem Ipsum</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Heading</span>
            <span className="spec-value">Lorem Ipsum</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Heading</span>
            <span className="spec-value">Lorem Ipsum</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Heading</span>
            <span className="spec-value">Lorem Ipsum</span>
          </div>
        </div>
      </section>

      {/* Product Features Section */}
      <section className="product-features-section">
        <h2 className="section-title">Product Features</h2>
        <div className="features-image-container">
          <button className="carousel-arrow left" onClick={prevImage}>‹</button>
          <div className="features-image">
            <img
              src={manufacturerImages[manufacturerImageIndex]}
              alt="Product features"
              className="features-img"
            />
          </div>
          <button className="carousel-arrow right" onClick={nextImage}>›</button>
        </div>
      </section>

      {/* Reviews & Ratings Section */}
      <section className="reviews-ratings-section">
        <h2 className="section-title">Reviews & Ratings</h2>
        
        <div className="reviews-container">
          <div className="overall-rating">
            <div className="rating-label">Overall Rating</div>
            <div className="rating-score">4.0</div>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i <= 4 ? "#0082FF" : "#E0E0E0"}>
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
              ))}
            </div>
            <div className="rating-based">Based on 25 ratings</div>
          </div>

          <div className="rating-bars">
            <div className="rating-bar">
              <div className="bar-fill" style={{ width: '60%', background: '#0082FF' }}></div>
            </div>
            <div className="rating-bar">
              <div className="bar-fill" style={{ width: '30%', background: '#4CAF50' }}></div>
            </div>
            <div className="rating-bar">
              <div className="bar-fill" style={{ width: '10%', background: '#FFC107' }}></div>
            </div>
            <div className="rating-bar">
              <div className="bar-fill" style={{ width: '0%', background: '#A0522D' }}></div>
            </div>
            <div className="rating-bar">
              <div className="bar-fill" style={{ width: '0%', background: '#F44336' }}></div>
            </div>
          </div>

          <div className="reviews-summary">
            <div className="summary-title">3334 Reviews, summarised</div>
            <ul className="summary-list">
              <li>Stunning display and powerful performance make it a top-tier phone.</li>
              <li>The pro-grade camera system captures incredible photos and videos.</li>
              <li>Innovative AI features enhance productivity and user experience.</li>
              <li>Some users have reported battery drain and heating issues.</li>
            </ul>
          </div>

          <div className="customer-photos">
            <div className="photos-header">
              <span className="photos-title">Customers Photos (1332)</span>
              <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="photos-grid">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="photo-placeholder"></div>
              ))}
            </div>
          </div>

          <div className="individual-reviews">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="review-item">
                <div className="review-avatar"></div>
                <div className="review-content">
                  <p className="review-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <div className="review-meta">
                    <span className="review-author">Ama Cruize</span>
                    <span className="verified-badge">
                      <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="9" fill="#111" />
                        <path d="M13 7l-4 4-2-2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Verified Purchase
                    </span>
                  </div>
                  <span className="review-date">Nov 12, 2024</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Also Liked Section */}
      <section className="customer-also-liked-section">
        <div className="section-header">
          <h2 className="section-title">Customer Also Liked These Products</h2>
          <a href="#" className="see-all-link">See All</a>
        </div>
        <div className="products-carousel">
          {Array.isArray(relatedList) && relatedList.length > 0 ? relatedList.slice(0, 4).map((product, index) => (
            <div key={product.id || `product-${index}`} className="product-card">
              <div className="product-badge">QLIQ's Choice</div>
              <div className="product-image-container">
                <img src={product.image || '/shoes.jpg'} alt={product.title} className="product-image" />
                <div className="product-actions">
                  <button className="action-btn heart-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#0082FF"/>
                    </svg>
                  </button>
                  <button className="action-btn cart-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="#0082FF"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.price}</div>
              </div>
            </div>
          )) : (
            <div className="no-products">No related products available</div>
          )}
        </div>
      </section>

      <style jsx>{`
        .product-sections {
          background: white;
          padding: 20px 16px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #000000;
          margin: 0 0 16px 0;
          line-height: 1.2;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .see-all-link {
          color: #0082FF;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }

        /* Related Products Section */
        .related-products-section {
          margin-bottom: 32px;
        }

        .products-carousel {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .products-carousel::-webkit-scrollbar {
          display: none;
        }

        .product-card {
          flex: 0 0 160px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .product-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #0082FF;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          z-index: 2;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 120px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
          z-index: 2;
        }

        .action-btn {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .product-info {
          padding: 12px;
        }

        .product-title {
          font-size: 14px;
          font-weight: 600;
          color: #000;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .product-price {
          font-size: 14px;
          font-weight: 700;
          color: #000;
          margin-bottom: 4px;
        }


        /* Product Overview Section */
        .product-overview-section {
          margin-bottom: 32px;
        }

        .overview-content {
          color: #666;
          line-height: 1.6;
          font-size: 14px;
        }

        .overview-content p {
          margin: 0 0 16px 0;
        }

        /* Product Specifications Section */
        .product-specifications-section {
          margin-bottom: 32px;
        }

        .specifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .spec-label {
          font-weight: 600;
          color: #000;
          font-size: 14px;
        }

        .spec-value {
          color: #666;
          font-size: 14px;
        }

        /* Product Features Section */
        .product-features-section {
          margin-bottom: 32px;
        }

        .features-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-radius: 12px;
        }

        .features-image {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .features-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          z-index: 2;
        }

        .carousel-arrow.left {
          left: 8px;
        }

        .carousel-arrow.right {
          right: 8px;
        }

        /* Reviews & Ratings Section */
        .reviews-ratings-section {
          margin-bottom: 32px;
        }

        .reviews-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .overall-rating {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .rating-label {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          margin-bottom: 8px;
        }

        .rating-score {
          font-size: 32px;
          font-weight: 700;
          color: #000;
          margin-bottom: 8px;
        }

        .rating-stars {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .rating-based {
          font-size: 14px;
          color: #666;
        }

        .rating-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rating-bar {
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .reviews-summary {
          background: white;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .summary-title {
          font-size: 16px;
          font-weight: 700;
          color: #000;
          margin-bottom: 12px;
        }

        .summary-list {
          margin: 0;
          padding-left: 16px;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .summary-list li {
          margin-bottom: 8px;
        }

        .customer-photos {
          background: white;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .photos-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .photos-title {
          font-size: 15px;
          font-weight: 700;
          color: #000;
        }

        .view-all-link {
          color: #0082FF;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
        }

        .photos-grid {
          display: flex;
          gap: 8px;
        }

        .photo-placeholder {
          width: 60px;
          height: 60px;
          background: #111;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .individual-reviews {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .review-avatar {
          width: 40px;
          height: 40px;
          background: #111;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .review-content {
          flex: 1;
        }

        .review-text {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin: 0 0 8px 0;
        }

        .review-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .review-author {
          font-size: 14px;
          font-weight: 600;
          color: #000;
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #666;
        }

        .review-date {
          font-size: 12px;
          color: #666;
        }

        /* Customer Also Liked Section */
        .customer-also-liked-section {
          margin-bottom: 100px; /* Account for bottom action bar */
        }

        .no-products {
          text-align: center;
          color: #666;
          padding: 20px;
          font-size: 14px;
        }

        /* Desktop Styles */
        @media (min-width: 769px) {
          .product-sections {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
          }

          .section-title {
            font-size: 28px;
            margin-bottom: 24px;
          }

          .products-carousel {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            overflow-x: visible;
          }

          .product-card {
            flex: none;
          }

          .reviews-container {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 40px;
          }

          .customer-also-liked-section {
            margin-bottom: 40px;
          }
        }
      `}</style>

      {/* View All Images Modal - Grid of 60px Thumbnails */}
      {viewAllOpen && (
        <div 
          className="lightbox-overlay"
          onClick={closeViewAll}
        >
          <div className="viewall-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeViewAll}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <h2 className="viewall-title">All Customer Photos ({reviewImages.length})</h2>
            
            <div className="viewall-grid">
              {reviewImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="viewall-thumbnail"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                  onClick={() => openImageFromViewAll(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal with Review */}
      {lightboxOpen && (
        <div 
          className="lightbox-overlay"
          onClick={closeLightbox}
        >
          <div className="lightbox-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="lightbox-content">
              <div className="lightbox-image-container">
                <img src={lightboxImage} alt="Review" className="lightbox-image" />
              </div>
              {lightboxReview && (
                <div className="lightbox-review-info">
                  <div className="lightbox-review-header">
                    <div className="lightbox-review-stars">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} style={{ color: i <= lightboxReview.rating ? '#FFB800' : '#ddd', fontSize: '18px' }}>★</span>
                      ))}
                    </div>
                    <span className="lightbox-review-author">{lightboxReview.title || 'Anonymous'}</span>
                  </div>
                  <p className="lightbox-review-comment">{lightboxReview.comment}</p>
                  <span className="lightbox-review-date">{formatReviewDate(lightboxReview.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryOpen && reviewImages.length > 0 && (
        <div 
          className="lightbox-overlay"
          onClick={closeGallery}
        >
          <div className="gallery-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeGallery}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            {/* Navigation Arrows */}
            {reviewImages.length > 1 && (
              <>
                <button className="gallery-nav gallery-prev" onClick={prevGalleryImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button className="gallery-nav gallery-next" onClick={nextGalleryImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </>
            )}

            <div className="gallery-main">
              <img src={reviewImages[currentGalleryIndex]} alt={`Gallery ${currentGalleryIndex + 1}`} className="gallery-image" />
              
              {/* Review Info for Current Image */}
              {reviewImagesData[currentGalleryIndex]?.review && (
                <div className="gallery-review-info">
                  <div className="gallery-review-header">
                    <div className="gallery-review-stars">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} style={{ color: i <= reviewImagesData[currentGalleryIndex].review.rating ? '#FFB800' : '#ddd', fontSize: '20px' }}>★</span>
                      ))}
                    </div>
                    <span className="gallery-review-author">{reviewImagesData[currentGalleryIndex].review.title || 'Anonymous'}</span>
                  </div>
                  <p className="gallery-review-comment">{reviewImagesData[currentGalleryIndex].review.comment}</p>
                  <span className="gallery-review-date">{formatReviewDate(reviewImagesData[currentGalleryIndex].review.createdAt)}</span>
                </div>
              )}
            </div>
            
            {/* <div className="gallery-counter">
              {currentGalleryIndex + 1} / {reviewImages.length}
            </div> */}

            {/* Thumbnail Strip */}
            {/* <div className="gallery-thumbnails">
              {reviewImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`gallery-thumbnail ${index === currentGalleryIndex ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${imageUrl})` }}
                  onClick={() => setCurrentGalleryIndex(index)}
                />
              ))}
            </div> */}
          </div>
        </div>
      )}

      <style jsx>{`
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
          padding: 20px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .lightbox-content-wrapper {
          position: relative;
          max-width: 1200px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .lightbox-content {
          display: flex;
          gap: 40px;
          align-items: center;
          background: #fff;
          border-radius: 12px;
          padding: 40px;
          max-width: 100%;
          animation: zoomIn 0.3s ease;
        }
        
        .lightbox-image-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .lightbox-image {
          max-width: 600px;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 8px;
        }
        
        .lightbox-review-info {
          flex: 0 0 300px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .lightbox-review-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .lightbox-review-stars {
          display: flex;
          gap: 2px;
        }
        
        .lightbox-review-author {
          font-weight: 600;
          font-size: 16px;
          color: #1a1a1a;
        }
        
        .lightbox-review-comment {
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          margin: 8px 0;
        }
        
        .lightbox-review-date {
          font-size: 12px;
          color: #666;
        }
        
        @keyframes zoomIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          z-index: 10;
        }
        
        .lightbox-close:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: rotate(90deg);
        }

        /* View All Images Modal Styles */
        .viewall-content {
          position: relative;
          background: #fff;
          border-radius: 16px;
          padding: 60px;
          max-width: 95vw;
          width: 1400px;
          max-height: 90vh;
          overflow-y: auto;
          animation: zoomIn 0.3s ease;
        }
        
        .viewall-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 40px;
          text-align: center;
        }
        
        .viewall-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, 120px);
          gap: 16px;
          justify-content: center;
          padding: 10px;
        }
        
        .viewall-thumbnail {
          width: 120px;
          height: 120px;
          background-size: cover;
          background-position: center;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid transparent;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .viewall-thumbnail:hover {
          transform: scale(1.1);
          border-color: #2196F3;
          box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
          z-index: 1;
        }

        /* Gallery Styles */
        .gallery-content-wrapper {
          position: relative;
          max-width: 1400px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .gallery-main {
          display: flex;
          gap: 40px;
          align-items: center;
          background: #fff;
          border-radius: 12px;
          padding: 40px;
          max-width: 100%;
          animation: zoomIn 0.3s ease;
        }
        
        .gallery-image {
          max-width: 700px;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 8px;
        }
        
        .gallery-review-info {
          flex: 0 0 350px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .gallery-review-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .gallery-review-stars {
          display: flex;
          gap: 4px;
        }
        
        .gallery-review-author {
          font-weight: 600;
          font-size: 18px;
          color: #1a1a1a;
        }
        
        .gallery-review-comment {
          font-size: 15px;
          line-height: 1.6;
          color: #333;
          margin: 8px 0;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .gallery-review-date {
          font-size: 13px;
          color: #666;
        }
        
        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.15);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          z-index: 10;
        }
        
        .gallery-nav:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-50%) scale(1.1);
        }
        
        .gallery-prev {
          left: 20px;
        }
        
        .gallery-next {
          right: 20px;
        }
        
        .gallery-counter {
          position: absolute;
          bottom: 140px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }
        
        .gallery-thumbnails {
          display: flex;
          gap: 8px;
          max-width: 100%;
          overflow-x: auto;
          padding: 10px 0;
          scrollbar-width: thin;
        }
        
        .gallery-thumbnails::-webkit-scrollbar {
          height: 6px;
        }
        
        .gallery-thumbnails::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .gallery-thumbnails::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .gallery-thumbnail {
          width: 70px;
          height: 70px;
          border-radius: 6px;
          background-size: cover;
          background-position: center;
          cursor: pointer;
          flex-shrink: 0;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          opacity: 0.6;
        }
        
        .gallery-thumbnail:hover {
          opacity: 1;
          transform: scale(1.05);
        }
        
        .gallery-thumbnail.active {
          border-color: #2196F3;
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .viewall-content {
            padding: 20px;
            max-width: 95vw;
          }
          
          .viewall-title {
            font-size: 20px;
            margin-bottom: 20px;
          }
          
          .viewall-grid {
            gap: 8px;
          }
          
          .lightbox-content {
            flex-direction: column;
            padding: 20px;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .lightbox-image {
            max-width: 100%;
            max-height: 50vh;
          }
          
          .lightbox-review-info {
            flex: 1;
            width: 100%;
          }
          
          .lightbox-close {
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
          }
          
          .gallery-main {
            flex-direction: column;
            padding: 20px;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .gallery-image {
            max-width: 100%;
            max-height: 50vh;
          }
          
          .gallery-review-info {
            flex: 1;
            width: 100%;
          }
          
          .gallery-nav {
            width: 40px;
            height: 40px;
          }
          
          .gallery-prev {
            left: 10px;
          }
          
          .gallery-next {
            right: 10px;
          }
          
          .gallery-counter {
            bottom: 120px;
          }
          
          .gallery-thumbnail {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  )
}