import Image from 'next/image'
import { useAuth } from '../contexts/AuthContext'
import { useSelector, useDispatch } from 'react-redux'
import { updateCartItem, removeFromCart, fetchCart } from '../store/slices/cartSlice'
import { useEffect } from 'react'
import { getUserFromCookies } from '../utils/userUtils'

export default function CartDrawer({ open, onClose }) {
    const { requireAuth, user } = useAuth()
    const dispatch = useDispatch()
    const { items, total, itemsCount, loading, error } = useSelector(state => state.cart)

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

    // Debug: Log cart data when it changes
    useEffect(() => {
        console.log('Cart data updated:', { items, total, itemsCount, loading, error })
    }, [items, total, itemsCount, loading, error])

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
                    dispatch(removeFromCart({ 
                        userId, 
                        productId 
                    }))
                }
            }
            removeItem()
        })
    }

    const handleAddToWishlist = (productId) => {
        requireAuth(() => {
            // Add to wishlist logic here
            console.log('Adding to wishlist from cart:', productId)
        })
    }

    const handleCheckout = () => {
        requireAuth(() => {
            // Redirect to checkout page
            window.location.href = '/checkout'
        })
    }

    if (!open) return null
    return (
        <div className="drawer-overlay">
            <div className="drawer">
                <div className="drawer-header">
                    <span className="drawer-title">Your Cart</span>
                    <button className="drawer-close" onClick={onClose}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <circle cx="14" cy="14" r="14" fill="#F5F5F5" />
                            <path d="M9 9L19 19M19 9L9 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="drawer-divider" />
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
                                    <path d="M16 16L20 44H44L48 16H16Z" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M20 20V12C20 8.68629 22.6863 6 26 6H38C41.3137 6 44 8.68629 44 12V20" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3>Your cart is empty</h3>
                            <p>Add some products to get started!</p>
                        </div>
                    ) : (
                        <div className="cart-items">
                            {items && items.length > 0 ? items.map((item) => (
                                <div key={item.productId} className="cart-item">
                                    <div className="cart-image-wrap">
                                        <Image 
                                            src={item.image || "/iphone.jpg"} 
                                            alt={item.name} 
                                            width={120} 
                                            height={100} 
                                            className="cart-image" 
                                        />
                                    </div>
                                    <div className="cart-info">
                                        <div className="cart-brand">{item.brand || 'Product'}</div>
                                        <div className="cart-name">{item.name}</div>
                                        <div className="cart-price">AED {item.price}</div>
                                        <div className="cart-actions">
                                            <div className='cart-qty-control'>
                                                <button 
                                                    className="cart-qty-btn"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="cart-qty">{item.quantity}</span>
                                                <button 
                                                    className="cart-qty-btn"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button 
                                                className="cart-wishlist-btn" 
                                                onClick={() => handleAddToWishlist(item.productId)}
                                            >
                                                <svg width="28" height="28" viewBox="6 0 28 26" fill="none">
                                                    <path d="M20.09 18.5586L20 18.6458L19.901 18.5586C15.626 14.8005 12.8 12.3155 12.8 9.7956C12.8 8.0518 14.15 6.7439 15.95 6.7439C17.336 6.7439 18.686 7.6158 19.163 8.8016H20.837C21.314 7.6158 22.664 6.7439 24.05 6.7439C25.85 6.7439 27.2 8.0518 27.2 9.7956C27.2 12.3155 24.374 14.8005 20.09 18.5586Z" stroke="#0082FF" strokeWidth="2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button 
                                        className="cart-remove-btn"
                                        onClick={() => handleRemoveItem(item.productId)}
                                    >
                                        Remove
                                    </button>
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
                <div className="drawer-footer">
                    <button 
                        className="drawer-checkout-btn" 
                        onClick={handleCheckout}
                        disabled={items.length === 0}
                    >
                        Checkout
                    </button>
                    <span className="drawer-total">AED {total.toFixed(2)}</span>
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
          width: 480px;
          max-width: 100vw;
          height: 100vh;
          box-shadow: -2px 0 16px rgba(0,0,0,0.08);
          border-radius: 0 0 0 0;
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.25s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 32px 0 32px;
        }
        .drawer-title {
          font-size: 24px;
          font-weight: 700;
          color: #111;
        }
        .drawer-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          border-radius: 50%;
        }
        .drawer-divider {
          border-bottom: 1px solid #e5e5e5;
          margin: 16px 0 0 0;
        }
        .drawer-content {
          padding: 32px 24px 0 24px;
          flex: 1;
        }
        .cart-item {
          display: flex;
          align-items: flex-start;
          gap: 32px;
        }
        .cart-image-wrap {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e5e5e5;
          width: 120px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-image {
          border-radius: 12px;
          object-fit: contain;
          background: #fff;
        }
        .cart-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cart-brand {
          font-size: 14px;
          color: #222;
          font-weight: 600;
        }
        .cart-name {
          font-weight: 600;
          font-size: 18px;
          color: #000;
        }
        .cart-price {
          font-weight: 600;
          font-size: 16px;
          color: #000;
        }
        .cart-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
        }
          .cart-qty-control{
          background: #fff;
          border: 1px solid #555;
          border-radius: 100px;
          width: 106px;
          height: 40px;
          font-size: 18px;
          font-weight: 700;
          color: #222;
          display: flex;
          align-items: center;
          justify-content: center;
          }
        .cart-qty-btn {
          background: #fff;
          border: none;
          border-radius: 100px;
          width: 40px;
          height: 40px;
          font-size: 18px;
          font-weight: 700;
          color: #222;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-qty {
          font-size: 16px;
          font-weight: 600;
          color: #222;
          min-width: 24px;
          text-align: center;
        }
        .cart-wishlist-btn {
          background: #fff;
          border: 1.5px solid #0082FF;
          border-radius: 100px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-remove-btn {
          background: none;
          border: none;
          color: #888;
          font-size: 16px;
          font-weight: 500;
          margin-left: 16px;
          cursor: pointer;
        }
        .drawer-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-top: 1px solid #e5e5e5;
          background: #fff;
          position: sticky;
          bottom: 0;
        }
        .drawer-checkout-btn {
          background: #0082FF;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 14px 40px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: none;
        }
        .drawer-total {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          background: #0082FF;
          border-radius: 100px;
          padding: 14px 32px;
          margin-left: 16px;
        }
        .cart-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0082FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .cart-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }
        .cart-error button {
          background: #0082FF;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 12px;
        }
        .cart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }
        .empty-cart-icon {
          margin-bottom: 24px;
          opacity: 0.5;
        }
        .cart-empty h3 {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
        }
        .cart-empty p {
          color: #666;
          margin: 0;
        }
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .cart-qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .drawer-checkout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .drawer {
            width: 100vw;
            padding: 0;
          }
          .drawer-header,
          .drawer-content,
          .drawer-footer {
            padding: 16px;
          }
        }
      `}</style>
        </div>
    )
}
