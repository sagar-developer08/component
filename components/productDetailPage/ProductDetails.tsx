import { useState } from 'react';
import Image from 'next/image';
import OtherSellersDrawer from './OtherSellersDrawer';

export default function ProductDetails({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // Example sellers data
  const sellers = [
    {
      price: "1,200",
      discount: 25,
      orderTime: "21h 20m",
      deliveryDate: "23 Aug",
      rating: "4.8",
      positive: "97%",
      sellerName: "TeleGX",
      warranty: "1 Year Warranty"
    },
    {
      price: "1,000",
      discount: 25,
      orderTime: "21h 20m",
      deliveryDate: "23 Aug",
      rating: "4.8",
      positive: "97%",
      sellerName: "TeleGX",
      warranty: "1 Year Warranty"
    }
  ];

  return (
    <div className="product-details">
      <div className="product-main">
        {/* Left Side - Product Images */}
        <div className="product-images">
          <div className="main-image-container">
            <button className="nav-arrow left" onClick={prevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <Image
              src={product.images[currentImageIndex]}
              alt={product.name}
              width={500}
              height={500}
              className="main-image"
            />

            <button className="nav-arrow right" onClick={nextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="image-dots">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="product-info">
          {/* First row: Brand name and bought count */}
          <div className="first-row">
            <div className="brand-name">{product.brand}</div>
            <span className="bought-count">{product.boughtCount}</span>
          </div>

          {/* Second row: Product name and delivery time */}
          <div className="stats">
            <h1 className="product-name">{product.name}</h1>
            <span className="delivery-time">{product.deliveryTime}</span>
          </div>
          <div className="second-row-stats">
            <div className="stock-status">{product.stock}</div>
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 15.0742L12.4208 16.5384C12.8635 16.8067 13.406 16.41 13.2894 15.9084L12.6477 13.155L14.7885 11.3C15.1794 10.9617 14.9694 10.32 14.456 10.2792L11.6385 10.04L10.536 7.43836C10.3377 6.96586 9.66104 6.96586 9.4627 7.43836L8.3602 10.0342L5.5427 10.2734C5.02937 10.3142 4.81937 10.9559 5.2102 11.2942L7.35104 13.1492L6.70937 15.9025C6.5927 16.4042 7.1352 16.8009 7.57854 16.5325L10 15.0742Z" fill="#0082FF" />
                </svg>
              ))}
            </div>
          </div>
          <div className="pricing">
            <span className="original-price">AED {product.originalPrice.toLocaleString()}</span>
            <span className="current-price">AED {product.price.toLocaleString()}</span>
            <span className="discount">{product.discount}% Off</span>
          </div>

          {/* Color Selection */}
          <div className="selection-group">
            <label>Color:</label>
            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="selection-group">
            <label>Size:</label>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector and Share Section */}
          <div className="quantity-share-container">
            <div className="selection-group">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            <div className="share-section">
              <span>Share:</span>
              <div className="share-icons">
                <button className="share-icon instagram">📷</button>
                <button className="share-icon facebook">📘</button>
                <button className="share-icon twitter">🐦</button>
                <button className="share-icon whatsapp">📱</button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="add-to-cart">Add To Cart</button>
            <button className="add-to-favourite">Add To Favourite</button>
          </div>

          {/* Other Sellers */}
          <div className="other-sellers" onClick={() => setDrawerOpen(true)}>
            <span>Other Sellers</span>
            <button className="arrow-right">→</button>
          </div>

          {/* Promo Cards - Two in one row */}
          <div className="promo-cards-row">
            <div className="promo-card promo-card-outline">
              <div className="promo-card-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#111" />
                  <path d="M10.5 16.5L21.5 16.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 10.5L16 21.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12.5 12.5L19.5 19.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M19.5 12.5L12.5 19.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="promo-card-content">
                <div className="promo-card-title">Pay in 3 interest-free payments</div>
                <div className="promo-card-link">Learn More</div>
              </div>
            </div>
            <div className="promo-card promo-card-outline">
              <div className="promo-card-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#111" />
                  <path d="M10.5 16.5L21.5 16.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 10.5L16 21.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12.5 12.5L19.5 19.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M19.5 12.5L12.5 19.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="promo-card-content">
                <div className="promo-card-title">Pay in 3 interest-free payments</div>
                <div className="promo-card-link">Learn More</div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-item">
              <span className="icon">🚚</span>
              <span>Return Policy</span>
            </div>
            <div className="info-item">
              <span className="icon">⭐</span>
              <span>1 Year Warranty</span>
            </div>
            <div className="info-item">
              <span className="icon">🚚</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>

      <OtherSellersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} sellers={sellers} />

      <style jsx>{`
        .product-details {
          max-width: 1392px;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          padding: 40px 20px;
          width: 100%;
        }

        .product-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .product-images {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .main-image-container {
          position: relative;
          width: 600px;
          height: 687px;
          border-radius: 16px;
          overflow: hidden;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #333;
          z-index: 10;
        }

        .nav-arrow.left {
          left: 16px;
        }

        .nav-arrow.right {
          right: 16px;
        }

        .image-dots {
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0, 130, 255, 0.24);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .dot.active {
          background: #0082FF;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* First row: Brand name and bought count */
        .first-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand-name {
          color: #000;
          font-size: 16px;
          font-weight: 600;
        }

        .bought-count {
          color: #0082FF;
          font-size: 14px;
          font-weight: 600;
        }

        /* Second row: Product name and delivery time */
        .stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .second-row-stats {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 6px;
        }

        .product-name {
          font-size: 40px;
          font-weight: 600;
          color: #000;
          margin: 0;
          line-height: 1.2;
          flex: 1;
        }

        .delivery-time {
          color: #0082FF;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .stock-status {
          color: #000;
          font-size: 16px;
          font-weight: 600;
        }

        .rating {
          display: flex;
          gap: 4px;
        }

        .pricing {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .original-price {
          color: #666;
          text-decoration: line-through;
          font-size: 14px;
          font-weight: 600;
        }

        .current-price {
          color: #000;
          font-size: 24px;
          font-weight: 600;
        }

        .discount {
          color: #1FC70A;
          font-size: 14px;
          font-weight: 600;
        }

        .description {
          color: #000;
          line-height: 150%;
          margin: 0;
        }

        .selection-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }

        .selection-group label {
          font-weight: 600;
          color: #333;
          min-width: 70px;
        }

        .color-options, .size-options {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .color-btn {
          padding: 8px 32px;
          border: 2px solid #0082FF;
          border-radius: 25px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .size-btn {
          padding: 8px 24px;
          border: 2px solid #0082FF;
          border-radius: 25px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          white-space: nowrap;
        }

        .color-btn.selected, .size-btn.selected {
          border-color: #0082FF;
          background: #0082FF;
          color: white;
        }

        /* Quantity and Share Container */
        .quantity-share-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 25px;
          padding: 8px;
          width: fit-content;
        }

        .quantity-selector button {
          width: 32px;
          height: 32px;
          border: none;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 600;
        }

        .quantity-selector span {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
        }

        .add-to-cart {
          width: 100%;
          max-width: 342px;
          padding: 12px 40px;
          background: rgba(0, 130, 255, 0.24); 
          border: none;
          border-radius: 50px;
          color: #0082FF;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .add-to-favourite {
          padding: 12px 40px;
          width: 100%;
          max-width: 342px;
          background: white;
          color: #0082FF;
          border: 2px solid #0082FF;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .share-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .share-icons {
          display: flex;
          gap: 8px;
        }

        .share-icon {
          width: 40px;
          height: 40px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s ease;
        }

        .share-icon:hover {
          border-color: #0082FF;
          background: #f0f8ff;
        }

        .other-sellers {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          border: 2px solid #0082FF;
          border-radius: 50px;
          cursor: pointer;
        }

        .arrow-right {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #000;
        }

        /* Promo Cards - Two in one row */
        .promo-cards-row {
          display: flex;
          gap: 16px;
          width: 100%;
        }
        
        .promo-card {
          display: flex;
          align-items: center;
          border-radius: 16px;
          padding: 18px;
          flex: 1;
          box-sizing: border-box;
          gap: 12px;
          min-width: 0; /* Allows text truncation */
        }
        
        .promo-card-outline {
          border: 2px solid #2196F3;
          background: #fff;
        }
        
        .promo-card-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .promo-card-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0; /* Allows text truncation */
          flex: 1;
        }
        
        .promo-card-title {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .promo-card-link {
          font-size: 14px;
          font-weight: 600;
          color: #000;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          white-space: nowrap;
        }

        .additional-info {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #000;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
        }

        .info-item:hover {
          color: #0082FF;
        }

        @media (max-width: 768px) {
          .product-main {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .main-image-container {
            width: 100%;
            height: 400px;
          }

          .product-name {
            font-size: 24px;
          }

          .stats {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .first-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .action-buttons {
            flex-direction: column;
          }
          
          .quantity-share-container {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .promo-cards-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}