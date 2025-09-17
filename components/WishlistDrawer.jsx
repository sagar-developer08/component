import Image from 'next/image'
import { useAuth } from '../contexts/AuthContext'

export default function WishlistDrawer({ open, onClose }) {
  const { requireAuth } = useAuth()

  const handleAddToCart = () => {
    requireAuth(() => {
      // Add to cart logic here
      console.log('Adding to cart from wishlist')
    })
  }

  if (!open) return null
  return (
    <div className="drawer-overlay">
      <div className="drawer">
        <div className="drawer-header">
          <span className="drawer-title">Your Wishlist</span>
          <button className="drawer-close" onClick={onClose}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#F5F5F5" />
              <path d="M9 9L19 19M19 9L9 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="drawer-divider" />
        <div className="drawer-content">
          <div className="wishlist-item">
            <Image src="/iphone.jpg" alt="Nike Airforce 01" width={130} height={100} className="wishlist-image" />
            <div className="wishlist-info">
              <div className="wishlist-brand">Nike</div>
              <div className="wishlist-name">Airforce 01</div>
              <div className="wishlist-price">AED 1,200</div>
              <div className="wishlist-actions">
                <button className="wishlist-cart-btn" onClick={handleAddToCart}>
                  <svg width="28" height="28" viewBox="6 8 28 28" fill="none">
                    {/* <circle cx="14" cy="14" r="14" stroke="#0082FF" /> */}
                    <path d="M16.1818 15.1538C16.1818 15.1538 16.1818 11 20 11C23.8182 11 23.8182 15.1538 23.8182 15.1538M13 15.1538V29H27V15.1538H13Z" stroke="#0082FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <button className="wishlist-remove-btn">Remove</button>
          </div>
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
        }
        .drawer-divider {
          border-bottom: 1px solid #ddd;
          margin: 16px 0 0 0;
        }
        .drawer-content {
          padding: 24px 32px 0 32px;
          flex: 1;
        }
        .wishlist-item {
          display: flex;
          align-items: flex-start;
          gap: 24px;
        }
        .wishlist-image {
          border-radius: 12px;
          object-fit: cover;
          background: #F8F9FA;
          border: 1px solid #666;
        }
        .wishlist-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .wishlist-brand {
          font-size: 14px;
          color: #666;
        }
        .wishlist-name {
          font-weight: 600;
          font-size: 16px;
          color: #000;
        }
        .wishlist-price {
          font-weight: 600;
          font-size: 16px;
          color: #000;
        }
        .wishlist-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }
        .wishlist-cart-btn {
          background: #fff;
          border: 1px solid #0082FF;
          border-radius: 100px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wishlist-remove-btn {
          background: none;
          border: none;
          color: #888;
          font-size: 16px;
          font-weight: 500;
          margin-left: 16px;
          cursor: pointer;
        }
        @media (max-width: 600px) {
          .drawer {
            width: 100vw;
            padding: 0;
          }
          .drawer-header,
          .drawer-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}
