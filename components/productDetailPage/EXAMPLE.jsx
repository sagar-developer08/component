// ============================================================
// EXAMPLE: How to Use OtherSellersDrawer in Product Detail Page
// ============================================================

import { useState } from 'react';
import OtherSellersDrawer from './components/productDetailPage/OtherSellersDrawer';

function ProductDetailPage({ product }) {
  // 1. Add state to control drawer visibility
  const [showOtherSellers, setShowOtherSellers] = useState(false);

  return (
    <div className="product-detail-page">
      {/* Your existing product content */}
      <div className="product-header">
        <h1>{product.title}</h1>
        <div className="price-section">
          <span className="current-price">
            AED {product.discount_price || product.price}
          </span>
          {product.discount_price && (
            <span className="original-price">AED {product.price}</span>
          )}
        </div>
      </div>

      <div className="product-images">
        {product.images?.map((img, idx) => (
          <img key={idx} src={img} alt={product.title} />
        ))}
      </div>

      <div className="product-info">
        <p className="sold-by">
          Sold by: <strong>{product.store_id?.name}</strong>
        </p>

        {/* 2. Add "Other Sellers" button */}
        <button 
          className="other-sellers-btn"
          onClick={() => setShowOtherSellers(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          See Other Sellers
        </button>

        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>

        <div className="product-specs">
          <h3>Specifications</h3>
          {/* Your specs */}
        </div>

        {/* Add to Cart, Buy Now, etc. */}
        <div className="action-buttons">
          <button className="add-to-cart-btn">Add to Cart</button>
          <button className="buy-now-btn">Buy Now</button>
        </div>
      </div>

      {/* 3. Add OtherSellersDrawer component */}
      <OtherSellersDrawer
        open={showOtherSellers}
        onClose={() => setShowOtherSellers(false)}
        productId={product._id}
      />

      {/* Styles */}
      <style jsx>{`
        .product-detail-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .product-header {
          margin-bottom: 24px;
        }

        .product-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .price-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .current-price {
          font-size: 32px;
          font-weight: 700;
          color: #000;
        }

        .original-price {
          font-size: 20px;
          color: #999;
          text-decoration: line-through;
        }

        .product-images {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .product-images img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .product-info {
          margin-bottom: 32px;
        }

        .sold-by {
          font-size: 14px;
          color: #666;
          margin-bottom: 16px;
        }

        /* Other Sellers Button Styling */
        .other-sellers-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          margin-bottom: 24px;
          background: white;
          border: 2px solid #0082FF;
          border-radius: 24px;
          color: #0082FF;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .other-sellers-btn:hover {
          background: #0082FF;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 130, 255, 0.3);
        }

        .other-sellers-btn svg {
          transition: transform 0.2s;
        }

        .other-sellers-btn:hover svg {
          transform: scale(1.1);
        }

        .product-description {
          margin-bottom: 24px;
        }

        .product-description h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }

        .add-to-cart-btn,
        .buy-now-btn {
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-to-cart-btn {
          background: #CBE6FF;
          color: #0082FF;
          border: none;
        }

        .add-to-cart-btn:hover {
          background: #b3dbff;
        }

        .buy-now-btn {
          background: #0082FF;
          color: white;
          border: none;
        }

        .buy-now-btn:hover {
          background: #0066CC;
        }
      `}</style>
    </div>
  );
}

export default ProductDetailPage;

// ============================================================
// THAT'S IT! 🎉
// ============================================================
// 
// The OtherSellersDrawer will automatically:
// 1. Fetch products with the same name from different sellers
// 2. Show loading state while fetching
// 3. Display all sellers in your existing UI
// 4. Handle empty state if no other sellers exist
//
// Just pass the productId and it handles everything!
// ============================================================

