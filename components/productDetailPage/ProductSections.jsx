import ProductCard from '@/components/ProductCard'
import SectionHeader from '@/components/SectionHeader'
import ProductInformation from '@/components/productDetailPage/ProductInformation'
import { useState } from 'react'

export default function ProductSections({ relatedProducts, productData }) {
  const [expandedItem, setExpandedItem] = useState(0)
  const [manufacturerImageIndex, setManufacturerImageIndex] = useState(0)

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
    "/images/manufacturer-sneakers.jpg",
    "/images/manufacturer-2.jpg",
    "/images/manufacturer-3.jpg"
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
    <div>
      {/* Related Products Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Related Products"
            showNavigation={true}
            showButton={true}
            buttonText="Upgrade"
          />
          <div className="products-grid">
            {Array.isArray(relatedList) && relatedList.length > 0 ? relatedList.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id || `product-${index}`} {...product} />
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No related products available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Information Section */}
      {/* <ProductInformation /> */}

      {/* Product Description Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Product Overview"
            showNavigation={false}
            showButton={false}
            buttonText="Upgrade"
          />
          <div className="description-content">
            <p>{productData?.description || productData?.short_description || "Product description not available."}</p>
            {productData?.description && productData?.short_description && productData.description !== productData.short_description && (
              <>
                <br />
                <p>{productData.short_description}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Product Specifications Section */}
      <section className="section">
        <div className="container specifications-container">
          <SectionHeader
            title="Product Specifications"
            showNavigation={false}
            showButton={false}
            buttonText="Upgrade"
          />
          <div className="specifications-wrapper">
            <div className="spec-table spec-table-left">
              <table>
                <tbody>
                  {specifications.slice(0, Math.ceil(specifications.length / 2)).map((spec, index) => (
                    <tr key={index}>
                      <th>{spec.label}</th>
                      <td>{String(spec.value || '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="spec-table spec-table-right">
              <table>
                <tbody>
                  {attributes.slice(0, Math.ceil(attributes.length / 2)).map((attr, index) => (
                    <tr key={index}>
                      <th>{attr.label}</th>
                      <td>{String(attr.value || '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* From The Manufacturer Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="From The Manufacturer"
            showNavigation={false}
            showButton={false}
          />
        </div>

        {/* Full-width image container */}
        <div className="manufacturer-full-width">
          <div className="manufacturer-carousel">
            <button className="carousel-arrow left" onClick={prevImage}>‹</button>
            <div className="manufacturer-image">
              <img
                src={manufacturerImages[manufacturerImageIndex]}
                alt="Product from manufacturer"
                className="manufacturer-img"
              />
            </div>
            <button className="carousel-arrow right" onClick={nextImage}>›</button>
          </div>
        </div>
      </section>

      {/* Reviews & Ratings Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Reviews & Ratings"
            showNavigation={false}
            showButton={false}
          />
        </div>
        <div className="reviews-ratings-container">
          <div className="reviews-left">
            {/* Overall Rating Summary */}
            <div className="overall-rating-box">
              <div className="overall-rating-label">Overall Rating</div>
              <div className="overall-rating-score">4.0</div>
              <div className="overall-rating-stars">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} width="28" height="28" viewBox="0 0 24 24" fill={i <= 4 ? "#2196F3" : "#E0E0E0"} style={{ marginRight: 2 }}>
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
              <div className="overall-rating-based">Based on 25 ratings</div>
              <div className="overall-rating-bars">
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#2196F3" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 5</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '79%', background: '#2196F3' }}></div></div>
                  <span className="rating-bar-percent">79%</span>
                </div>
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#4CAF50" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 4</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '9%', background: '#4CAF50' }}></div></div>
                  <span className="rating-bar-percent">09%</span>
                </div>
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC107" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 3</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '3%', background: '#FFC107' }}></div></div>
                  <span className="rating-bar-percent">03%</span>
                </div>
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#A0522D" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 2</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '2%', background: '#A0522D' }}></div></div>
                  <span className="rating-bar-percent">02%</span>
                </div>
                <div className="rating-bar-row">
                  <span className="rating-bar-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="#F44336" style={{ verticalAlign: 'middle' }}><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" /></svg> 1</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '8%', background: '#F44336' }}></div></div>
                  <span className="rating-bar-percent">08%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="reviews-right">
            <div className="reviews-summary">
              <div className="summary-title">3334 Reviews, summarised</div>
              <ul className="summary-list">
                <li>Stunning display and powerful performance make it a top-tier phone.</li>
                <li>The pro-grade camera system captures incredible photos and videos.</li>
                <li>Innovative AI features enhance productivity and user experience.</li>
                <li>Some users have reported battery drain and heating issues.</li>
              </ul>
              <div className="customer-photos-row">
                <span className="customer-photos-title">Customers Photos (1332)</span>
                <a className="customer-photos-viewall" href="#">View All</a>
              </div>
              <div className="customer-photos-list">
                {[...Array(7)].map((_, i) => (
                  <div className="customer-photo" key={i}></div>
                ))}
              </div>
            </div>
            <div className="reviews-list">
              {[...Array(4)].map((_, i) => (
                <div className="review-item" key={i}>
                  <div className="review-photo"></div>
                  <div className="review-content">
                    <div className="review-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse varius enim in eros elementum tristique | orem ipsum dolor sit amet, consectetur adipiscing.
                    </div>
                    <div className="review-meta">
                      <span className="review-author">Ama Cruize</span>
                      <span className="review-verified">
                        <svg width="18" height="18" viewBox="0 0 18 18" style={{ verticalAlign: 'middle', marginRight: 4 }}><circle cx="9" cy="9" r="9" fill="#111" /><path d="M13 7l-4 4-2-2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Verified Purchase
                      </span>
                    </div>
                    <span className="review-date">Nov 12, 2024</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Customer Also Liked These Products"
            showNavigation={true}
            showButton={false}
            buttonText="Upgrade"
          />
          <div className="products-grid">
            {Array.isArray(relatedList) && relatedList.length > 0 ? relatedList.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id || `product-${index}`} {...product} />
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No related products available
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .product-sections {
          max-width: 1360px;
          margin: auto;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #000000;
          margin: 0 0 48px 0;
          text-align: center;
          line-height: 1.2;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }

        .products-carousel {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .manufacturer-full-width {
          width: 100%;
          margin-top: 24px;
        }

        .manufacturer-carousel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .carousel-arrow {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: transparent;
          color: #000;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .carousel-arrow.left {
          left: 60px;
        }

        .carousel-arrow.right {
          right: 60px;
        }

        .accordion-container {
          max-width: 900px;
          margin: 0 auto;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: white;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .accordion {
          display: flex;
          flex-direction: column;
        }

        .accordion-item {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0;
          overflow: hidden;
          margin-bottom: 0;
          background: white;
          box-shadow: none;
          transition: all 0.2s ease;
        }

        .accordion-item:last-child {
          border-bottom: none;
        }

        .accordion-item.expanded {
          border-color: #e5e7eb;
          box-shadow: none;
        }

        .accordion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          background: #ffffff;
          cursor: pointer;
          transition: background 0.2s ease;
          border: none;
          width: 100%;
          text-align: left;
        }

        .accordion-item.expanded .accordion-header {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .accordion-header:hover {
          background: #f9f9f9;
        }

        .accordion-title {
          font-size: 16px;
          font-weight: 500;
          color: #000000;
          margin: 0;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }

        .accordion-toggle {
          background: none;
          border: none;
          font-size: 24px;
          color: #666666;
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          transition: all 0.2s ease;
        }

        .accordion-content {
          padding: 24px 32px;
          background: white;
          line-height: 1.6;
        }

        .accordion-content p {
          margin: 0;
          line-height: 1.6;
          color: #666666;
          font-size: 15px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }

        .description-container {
          max-width: 900px;
          margin: 0 auto;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .description-content {
          max-width: 1392px;
          width: 100%;
          background: white;
          padding-left: 24px;
          padding-right: 24px;
          border: none;
          border-radius: 0;
          box-shadow: none;
        }

        .description-content p {
          line-height: 150%;
          color: #000;
          font-size: 16px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-weight: 600;
        }

        .description-content p:last-child {
          margin-bottom: 0;
        }

        .manufacturer-image {
          width: 100%;
          height: 500px;
          overflow: hidden;
          background: #f0f8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .manufacturer-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .specifications-container {
          max-width: 1392px;
          padding-left: 0;
          padding-right: 0;
        }
        .specifications-wrapper {
          display: flex;
          gap: 0;
          justify-content: center;
          align-items: flex-start;
          margin-top: 24px;
          width: 100%;
          max-width: 1392px;
          padding: 0 12px;
        }
        .spec-table {
          flex: 1;
          min-width: 0;
          max-width: 50%;
        }
        .spec-table table {
          width: 100%;
          max-width: 1392px;
          border-collapse: collapse;
        }
        .spec-table th,
        .spec-table td {
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 600;
          text-align: left;
          padding: 12px 16px;
        }
        .spec-table th {
          color: #111;
          background: transparent;
          width: 160px;
        }
        .spec-table td {
          color: #222;
        }
        /* Right table: normal coloring */
        .spec-table-right tr:nth-child(even) td,
        .spec-table-right tr:nth-child(even) th {
          background: #f7f7f7;
        }
        .spec-table-right tr:nth-child(odd) td,
        .spec-table-right tr:nth-child(odd) th {
          background: #fff;
        }
        /* Left table: inverted coloring */
        .spec-table-left tr:nth-child(odd) td,
        .spec-table-left tr:nth-child(odd) th {
          background: #f7f7f7;
        }
        .spec-table-left tr:nth-child(even) td,
        .spec-table-left tr:nth-child(even) th {
          background: #fff;
        }
        @media (max-width: 900px) {
          .specifications-wrapper {
            flex-direction: column;
            gap: 0;
          }
          .spec-table {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 28px;
            margin-bottom: 32px;
          }

          .section {
            margin-bottom: 60px;
          }

          .accordion-container {
            max-width: 100%;
            border-radius: 12px;
          }

          .accordion-header {
            padding: 20px 24px;
          }

          .accordion-title {
            font-size: 15px;
          }

          .accordion-toggle {
            font-size: 22px;
            width: 24px;
            height: 24px;
          }

          .accordion-content {
            padding: 20px 24px;
          }

          .accordion-content p {
            font-size: 14px;
          }

          .description-container {
            max-width: 100%;
            border-radius: 12px;
          }

          .description-content {
            padding: 24px;
          }

          .description-content p {
            font-size: 14px;
            margin-bottom: 16px;
          }

          .carousel-arrow {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .carousel-arrow.left {
            left: 10px;
          }

          .carousel-arrow.right {
            right: 10px;
          }

          .manufacturer-image {
            height: 300px;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 24px;
            margin-bottom: 24px;
          }

          .accordion-header {
            padding: 16px 20px;
          }

          .accordion-content {
            padding: 16px 20px;
          }

          .description-content {
            padding: 20px;
          }

          .manufacturer-image {
            height: 200px;
          }

          .carousel-arrow {
            width: 36px;
            height: 36px;
            font-size: 18px;
          }
        }

        .reviews-ratings-container {
          display: flex;
          gap: 48px;
          max-width: 1392px;
          margin: 0 auto;
          padding: 0 24px;
        }
          .reviews-left {
          flex: 1;
          max-width: 340px;
        }
        .reviews-title {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 8px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
          .reviews-title-2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
        .overall-rating-box {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          margin-bottom: 32px;
          min-width: 320px;
          max-width: 340px;
        }
        .overall-rating-label {
          font-size: 24px;
          font-weight: 600;
          color: #000;
          margin-bottom: 0;
        }
        .overall-rating-score {
          font-size: 48px;
          font-weight: 700;
          color: #111;
          margin-bottom: 4px;
        }
        .overall-rating-stars {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .overall-rating-based {
          font-size: 15px;
          color: #222;
          margin-bottom: 18px;
        }
        .overall-rating-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rating-bar-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
        }
        .rating-bar-label {
          width: 48px;
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: 600;
        }
        .rating-bar-track {
          flex: 1;
          height: 8px;
          background: #eee;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 8px;
        }
        .rating-bar-fill {
          height: 100%;
          border-radius: 8px;
        }
        .rating-bar-percent {
          width: 38px;
          text-align: right;
          font-weight: 600;
        }
        .reviews-left {
          flex: 1;
          max-width: 340px;
        }
        .reviews-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 32px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
          .reviews-title-2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
        }
        .review-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-input, .form-textarea {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 10px 14px;
          font-size: 16px;
          font-family: inherit;
          background: #fff;
          margin-bottom: 0;
        }
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #000; /* Black placeholder text */
        }
        .form-upload-container {
          width: 100%;
        }
        .form-upload-label {
          display: block;
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 10px 14px;
          font-size: 16px;
          font-family: inherit;
          background: #fff;
          color: #000; /* Black text for upload label */
          cursor: pointer;
          text-align: left;
        }
        .upload-input {
          display: none;
        }
        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }
        .form-cancel {
          flex: 1;
          background: #fff;
          border: 1px solid #111;
          color: #111;
          border-radius: 24px;
          font-size: 16px;
          font-weight: 500;
          padding: 8px 0;
          cursor: pointer;
        }
        .form-submit {
          flex: 1;
          background: #cbe6ff;
          border: none;
          color: #111;
          border-radius: 24px;
          font-size: 16px;
          font-weight: 500;
          padding: 8px 0;
          cursor: pointer;
        }
        .reviews-right {
          flex: 2.2;
          min-width: 0;
        }
        .reviews-summary {
          margin-bottom: 24px;
        }
        .summary-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .summary-list {
          margin: 0 0 18px 0;
          padding-left: 18px;
          font-size: 16px;
          color: #222;
          font-weight: 600;
        }
        .customer-photos-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .customer-photos-title {
          font-size: 15px;
          font-weight: 600;
          color: #222;
        }
        .customer-photos-viewall {
          font-size: 15px;
          color: #007aff;
          font-weight: 500;
          text-decoration: none;
        }
        .customer-photos-list {
          display: flex;
          gap: 16px;
          margin-bottom: 18px;
        }
        .customer-photo {
          width: 108px;
          height: 108px;
          border-radius: 12px;
          background: #111;
          display: inline-block;
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .review-item {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          flex-direction: column;
        }
        .review-photo {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: #111;
          flex-shrink: 0;
        }
        .review-content {
          flex: 1;
        }
        .review-text {
          font-size: 16px;
          color: #222;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .review-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #222;
          margin-bottom: 4px;
        }
        .review-author {
          font-weight: 600;
          font-size: 16px;
          color: #000;
        }
        .review-verified {
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: 600;
          font-size: 16px;
          color: #000;
        }
        .review-date {
          color: #000;
          font-size: 14px;
          font-weight: 600;
        }
        @media (max-width: 1100px) {
          .reviews-ratings-container {
            flex-direction: column;
            gap: 32px;
            padding: 0 12px;
          }
          .reviews-left, .reviews-right {
            max-width: 100%;
          }
        }
        @media (max-width: 768px) {
          .reviews-title {
            font-size: 1.3rem;
            margin-bottom: 18px;
          }
          .reviews-ratings-container {
            padding: 0 4px;
          }
          .customer-photo {
            width: 54px;
            height: 54px;
          }
          .review-photo {
            width: 36px;
            height: 36px;
          }
        }
        @media (max-width: 480px) {
          .reviews-title {
            font-size: 1.1rem;
          }
          .customer-photo {
            width: 38px;
            height: 38px;
          }
          .review-photo {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  )
}