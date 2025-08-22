import Image from 'next/image'
import { useState } from 'react'

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    brand: string
    price: number
    originalPrice: number
    discount: number
    rating: number
    stock: string
    deliveryTime: string
    boughtCount: string
    description: string
    images: string[]
    colors: string[]
    sizes: string[]
  }
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="product-details">
      <div className="product-main">
        {/* Left Side - Product Images */}
        <div className="product-images">
          <div className="main-image-container">
            <button className="nav-arrow left" onClick={prevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
          <div className="brand-name">{product.brand}</div>
          <h1 className="product-name">{product.name}</h1>
          
          <div className="stats">
            <span className="bought-count">{product.boughtCount}</span>
            <span className="delivery-time">{product.deliveryTime}</span>
          </div>
          
          <div className="stock-status">{product.stock}</div>
          
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 15.0742L12.4208 16.5384C12.8635 16.8067 13.406 16.41 13.2894 15.9084L12.6477 13.155L14.7885 11.3C15.1794 10.9617 14.9694 10.32 14.456 10.2792L11.6385 10.04L10.536 7.43836C10.3377 6.96586 9.66104 6.96586 9.4627 7.43836L8.3602 10.0342L5.5427 10.2734C5.02937 10.3142 4.81937 10.9559 5.2102 11.2942L7.35104 13.1492L6.70937 15.9025C6.5927 16.4042 7.1352 16.8009 7.57854 16.5325L10 15.0742Z" fill="#0082FF"/>
              </svg>
            ))}
          </div>
          
          <div className="pricing">
            <span className="original-price">AED {product.originalPrice.toLocaleString()}</span>
            <span className="current-price">AED {product.price.toLocaleString()}</span>
            <span className="discount">{product.discount}% Off</span>
          </div>
          
          <p className="description">{product.description}</p>
          
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
          
          {/* Quantity Selector */}
          <div className="selection-group">
            <label>Quantity:</label>
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="add-to-cart">Add To Cart</button>
            <button className="add-to-favourite">Add To Favourite</button>
          </div>
          
          {/* Share Options */}
          <div className="share-section">
            <span>Share:</span>
            <div className="share-icons">
              <button className="share-icon instagram">📷</button>
              <button className="share-icon facebook">📘</button>
              <button className="share-icon twitter">🐦</button>
              <button className="share-icon whatsapp">📱</button>
            </div>
          </div>
          
          {/* Other Sellers */}
          <div className="other-sellers">
            <span>Other Sellers</span>
            <button className="arrow-right">→</button>
          </div>
          
          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-item">
              <span className="icon">❓</span>
              <span>Ask a question</span>
            </div>
            <div className="info-item">
              <span className="icon">🚚</span>
              <span>Delivery Return</span>
            </div>
            <div className="info-item">
              <span className="icon">⭐</span>
              <span>1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-details {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .product-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .product-images {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .main-image-container {
          position: relative;
          width: 500px;
          height: 500px;
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

        .brand-name {
          color: #666;
          font-size: 16px;
          font-weight: 500;
        }

        .product-name {
          font-size: 32px;
          font-weight: 700;
          color: #000;
          margin: 0;
          line-height: 1.2;
        }

        .stats {
          display: flex;
          gap: 16px;
        }

        .bought-count, .delivery-time {
          color: #0082FF;
          font-size: 14px;
          font-weight: 500;
        }

        .stock-status {
          color: #22c55e;
          font-size: 14px;
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
          font-size: 18px;
        }

        .current-price {
          color: #000;
          font-size: 28px;
          font-weight: 700;
        }

        .discount {
          color: #22c55e;
          font-size: 16px;
          font-weight: 600;
        }

        .description {
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .selection-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .selection-group label {
          font-weight: 600;
          color: #333;
        }

        .color-options, .size-options {
          display: flex;
          gap: 12px;
        }

        .color-btn, .size-btn {
          padding: 12px 24px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .color-btn.selected, .size-btn.selected {
          border-color: #0082FF;
          background: #0082FF;
          color: white;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px;
          width: fit-content;
        }

        .quantity-selector button {
          width: 32px;
          height: 32px;
          border: none;
          background: #f3f4f6;
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
          flex: 1;
          padding: 16px 32px;
          background: #0082FF;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .add-to-cart:hover {
          background: #0066cc;
        }

        .add-to-favourite {
          padding: 16px 32px;
          background: white;
          color: #0082FF;
          border: 2px solid #0082FF;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-to-favourite:hover {
          background: #f0f8ff;
        }

        .share-section {
          display: flex;
          align-items: center;
          gap: 16px;
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
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
        }

        .arrow-right {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
        }

        .additional-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #666;
          cursor: pointer;
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

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
