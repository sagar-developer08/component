import Image from 'next/image'
import { useAuth } from '../contexts/AuthContext'

export default function CartDrawer({ open, onClose }) {
    const { requireAuth } = useAuth()

    const handleAddToWishlist = () => {
        requireAuth(() => {
            // Add to wishlist logic here
            console.log('Adding to wishlist from cart')
        })
    }

    const handleCheckout = () => {
        requireAuth(() => {
            // Checkout logic here
            console.log('Proceeding to checkout')
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
                    <div className="cart-item">
                        <div className="cart-image-wrap">
                            <Image src="/iphone.jpg" alt="Nike Airforce 01" width={120} height={100} className="cart-image" />
                        </div>
                        <div className="cart-info">
                            <div className="cart-brand">Nike</div>
                            <div className="cart-name">Airforce 01</div>
                            <div className="cart-price">AED 1,200</div>
                            <div className="cart-actions">
                                <div className='cart-qty-control'>
                                    <button className="cart-qty-btn">-</button>
                                    <span className="cart-qty">1</span>
                                    <button className="cart-qty-btn">+</button>
                                </div>

                                <button className="cart-wishlist-btn" onClick={handleAddToWishlist}>
                                    <svg width="28" height="28" viewBox="6 0 28 26" fill="none">
                                        {/* <circle cx="14" cy="14" r="13" stroke="#0082FF" strokeWidth="2"/> */}
                                        <path d="M20.09 18.5586L20 18.6458L19.901 18.5586C15.626 14.8005 12.8 12.3155 12.8 9.7956C12.8 8.0518 14.15 6.7439 15.95 6.7439C17.336 6.7439 18.686 7.6158 19.163 8.8016H20.837C21.314 7.6158 22.664 6.7439 24.05 6.7439C25.85 6.7439 27.2 8.0518 27.2 9.7956C27.2 12.3155 24.374 14.8005 20.09 18.5586Z" stroke="#0082FF" strokeWidth="2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button className="cart-remove-btn">Remove</button>
                    </div>
                </div>
                <div className="drawer-footer">
                    <button className="drawer-checkout-btn" onClick={handleCheckout}>Checkout</button>
                    <span className="drawer-total">AED 1,200</span>
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
