import Image from 'next/image'
import { useAuth } from '../contexts/AuthContext'
import { useSelector, useDispatch } from 'react-redux'
import { updateCartItem, removeFromCart, fetchCart, moveToWishlist } from '../store/slices/cartSlice'
import { fetchWishlist } from '../store/slices/wishlistSlice'
import { useEffect } from 'react'
import { getUserFromCookies } from '../utils/userUtils'
import { useToast } from '../contexts/ToastContext'

export default function CartDrawer({ open, onClose }) {
  const { requireAuth, user } = useAuth()
  const dispatch = useDispatch()
  const { items, total, itemsCount, loading, error } = useSelector(state => state.cart)
  const { show } = useToast()

  // Fetch cart when drawer opens and user is authenticated
  useEffect(() => {
    if (open) {
      const fetchUserCart = async () => {
        let userId = user?.id || await getUserFromCookies()
        if (userId) {
          console.log('Fetching cart for userId:', userId)
          dispatch(fetchCart(userId))
        }
      }
      fetchUserCart()
    }
  }, [open, user?.id, dispatch])

  const handleQuantityChange = (productId, newQuantity) => {
    requireAuth(() => {
      const updateQuantity = async () => {
        const userId = user?.id || await getUserFromCookies()
        if (userId) {
          console.log('Updating quantity:', { userId, productId, newQuantity })
          dispatch(updateCartItem({
            userId,
            productId,
            quantity: newQuantity
          }))
        }
      }
      updateQuantity()
    })
  }

  const handleRemoveItem = (productId) => {
    requireAuth(() => {
      const removeItem = async () => {
        const userId = user?.id || await getUserFromCookies()
        if (userId) {
          console.log('Removing item:', { userId, productId })
          dispatch(removeFromCart({ userId, productId }))
          show('Item removed from cart', 'success')
        }
      }
      removeItem()
    })
  }

  const handleMoveToWishlist = (productId) => {
    requireAuth(() => {
      const moveItem = async () => {
        const userId = user?.id || await getUserFromCookies()
        if (userId) {
          console.log('Moving to wishlist:', { userId, productId })
          dispatch(moveToWishlist({ userId, productId }))
          dispatch(fetchWishlist(userId))
          show('Item moved to wishlist', 'success')
        }
      }
      moveItem()
    })
  }

  const handleCheckout = () => {
    requireAuth(() => {
      // Navigate to checkout page
      window.location.href = '/checkout'
    })
  }

  if (!open) return null
  return (
    <div className="drawer-overlay">
      <div className="drawer">
        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="header-top">
            <div className="time">9:30</div>
            <div className="camera-indicator"></div>
          </div>
          
          <div className="header-main">
            <div className="header-left">
              <div className="location-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="black"/>
                </svg>
              </div>
            </div>
            
            <div className="header-center">
              <div className="qliq-logo">QLIQ</div>
            </div>
            
            <div className="header-right">
              <div className="header-icons">
                <div className="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="black"/>
                  </svg>
                </div>
                <div className="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="black"/>
                  </svg>
                </div>
                <div className="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="black"/>
                  </svg>
                </div>
                <div className="header-icon profile">
                  <div className="profile-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="black"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-content">
          {loading ? (
            <div className="cart-loading">
              <div className="loading-spinner"></div>
              <p>Loading cart...</p>
            </div>
          ) : error ? (
            <div className="cart-error">
              <p>Error loading cart: {error}</p>
              <button onClick={() => user?.id && dispatch(fetchCart(user.id))}>
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-cart-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <path d="M16 16L20 44H44L48 16H16Z" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 20V12C20 8.68629 22.6863 6 26 6H38C41.3137 6 44 8.68629 44 12V20" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            <div className="cart-items">
              {items && items.length > 0 ? items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="cart-item">
                  <div className="cart-image-container">
                    <Image
                      src={item.image || '/shoes.jpg'}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="cart-image"
                    />
                  </div>
                  
                  <div className="cart-item-info">
                    <div className="cart-brand">{item.brand || 'Brand'}</div>
                    <div className="cart-name">{item.name}</div>
                    <div className="cart-price">AED {item.price}</div>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button 
                          className="qty-btn minus"
                          onClick={() => handleQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button 
                          className="qty-btn plus"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="cart-item-right">
                        <button 
                          className="heart-btn"
                          onClick={() => handleMoveToWishlist(item.productId)}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#666"/>
                          </svg>
                        </button>
                        <button 
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="cart-empty">
                  <h3>No items found</h3>
                  <p>Something went wrong loading your cart.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Checkout Bar */}
        <div className="checkout-bar">
          <div className="checkout-content">
            <span className="checkout-label">Checkout</span>
            <span className="checkout-total">AED {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Fox Icon */}
        <div className="fox-icon">
          <span>🦊</span>
        </div>
      </div>
      <style jsx>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.08);
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
        }
        
        .drawer {
          background: #fff;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.25s cubic-bezier(.4,0,.2,1);
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        /* Mobile Header */
        .mobile-header {
          background: white;
          padding: 0;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px 0 16px;
          height: 24px;
        }

        .time {
          font-size: 14px;
          font-weight: 600;
          color: #000;
        }

        .camera-indicator {
          width: 4px;
          height: 4px;
          background: #000;
          border-radius: 50%;
        }

        .header-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .header-left {
          flex: 1;
        }

        .location-icon {
          width: 20px;
          height: 20px;
        }

        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .qliq-logo {
          font-size: 18px;
          font-weight: 700;
          color: #0082FF;
        }

        .header-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .header-icons {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .header-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Drawer Content */
        .drawer-content {
          flex: 1;
          padding: 20px 16px;
          overflow-y: auto;
          padding-bottom: 100px;
        }

        .cart-loading, .cart-error, .cart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0082FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .cart-empty h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 16px 0 8px 0;
        }

        .cart-empty p {
          font-size: 14px;
          color: #666;
        }

        /* Cart Items */
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cart-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: white;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
        }

        .cart-image-container {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          background: #f8f8f8;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .cart-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cart-brand {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .cart-name {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          line-height: 1.3;
        }

        .cart-price {
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          background: #f8f8f8;
          border-radius: 20px;
          padding: 4px 8px;
          gap: 8px;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: #0082FF;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
        }

        .qty-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .qty-number {
          min-width: 20px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
        }

        .cart-item-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .heart-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #999;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
        }

        /* Bottom Checkout Bar */
        .checkout-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #f0f8ff;
          border-top: 1px solid #e0e0e0;
          padding: 16px;
          z-index: 1000;
        }

        .checkout-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 100%;
        }

        .checkout-label {
          font-size: 16px;
          font-weight: 600;
          color: #0082FF;
        }

        .checkout-total {
          font-size: 16px;
          font-weight: 600;
          color: #0082FF;
        }

        /* Fox Icon */
        .fox-icon {
          position: fixed;
          bottom: 80px;
          right: 16px;
          width: 32px;
          height: 32px;
          background: #ff6b35;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          z-index: 1001;
        }

        /* Desktop Styles */
        @media (min-width: 769px) {
          .drawer {
            width: 480px;
            max-width: 100vw;
          }

          .mobile-header {
            display: none;
          }

          .drawer-content {
            padding: 32px;
          }

          .cart-item {
            flex-direction: row;
            align-items: flex-start;
          }

          .cart-image-container {
            width: 120px;
            height: 120px;
          }

          .cart-item-actions {
            flex-direction: row;
            align-items: center;
            gap: 16px;
          }

          .checkout-bar {
            position: relative;
            background: white;
            border-top: 1px solid #e0e0e0;
          }

          .fox-icon {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}