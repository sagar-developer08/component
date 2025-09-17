import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

export default function ProductCard({ 
  id = "nike-airforce-01",
  title, 
  price, 
  rating, 
  deliveryTime, 
  image, 
  badge = "-$500 on your first order",
  showIcons = true 
}) {
  const router = useRouter()
  const { requireAuth } = useAuth()
  const [imageError, setImageError] = useState(false)
  
  // Fallback image URL
  const fallbackImage = 'https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644'
  const imageSrc = imageError ? fallbackImage : image

  const handleCardClick = () => {
    router.push(`/product/${id}`)
  }

  const handleWishlistClick = (e) => {
    e.stopPropagation()
    requireAuth(() => {
      // Add to wishlist logic here
      console.log('Adding to wishlist:', id)
    })
  }

  const handleCartClick = (e) => {
    e.stopPropagation()
    requireAuth(() => {
      // Add to cart logic here
      console.log('Adding to cart:', id)
    })
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <Image
          src={imageSrc}
          alt={title}
          width={322}
          height={222}
          style={{ borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.16)' }}
          onError={handleImageError}
          unoptimized={true}
        />
        
        {badge && (
          <div className="product-badge">
            {badge}
          </div>
        )}

        <div className="product-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        {showIcons && (
          <>
            <button className="wishlist-icon" aria-label="Add to wishlist" onClick={handleWishlistClick}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill="#0082FF"/>
                <path d="M20.09 25.5586L20 25.6458L19.901 25.5586C15.626 21.8005 12.8 19.3155 12.8 16.7956C12.8 15.0518 14.15 13.7439 15.95 13.7439C17.336 13.7439 18.686 14.6158 19.163 15.8016H20.837C21.314 14.6158 22.664 13.7439 24.05 13.7439C25.85 13.7439 27.2 15.0518 27.2 16.7956C27.2 19.3155 24.374 21.8005 20.09 25.5586ZM24.05 12C22.484 12 20.981 12.7063 20 13.8136C19.019 12.7063 17.516 12 15.95 12C13.178 12 11 14.1014 11 16.7956C11 20.0828 14.06 22.7771 18.695 26.849L20 28L21.305 26.849C25.94 22.7771 29 20.0828 29 16.7956C29 14.1014 26.822 12 24.05 12Z" fill="white"/>
              </svg>
            </button>

            <button className="cart-icon" aria-label="Add to cart" onClick={handleCartClick}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill="#0082FF"/>
                <path d="M16.1818 15.1538C16.1818 15.1538 16.1818 11 20 11C23.8182 11 23.8182 15.1538 23.8182 15.1538M13 15.1538V29H27V15.1538H13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="product-info">
        <div className="product-title-row">
          <h3 className="product-title">{title}</h3>
          <div className="delivery-time">
            {deliveryTime}
          </div>
        </div>

        <div className="product-bottom">
          <div className="product-price">{price}</div>
          <div className="product-rating">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6.99937 10.0742L9.4202 11.5384C9.86354 11.8067 10.406 11.41 10.2894 10.9084L9.64771 8.15503L11.7885 6.30003C12.1794 5.96169 11.9694 5.32003 11.456 5.27919L8.63854 5.04003L7.53604 2.43836C7.3377 1.96586 6.66104 1.96586 6.4627 2.43836L5.3602 5.03419L2.5427 5.27336C2.02937 5.31419 1.81937 5.95586 2.2102 6.29419L4.35104 8.14919L3.70937 10.9025C3.5927 11.4042 4.1352 11.8009 4.57854 11.5325L6.99937 10.0742Z" fill="#0082FF"/>
            </svg>
            <span>{rating}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          position: relative;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .product-image {
          width: 322px;
          height: 222px;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.16);
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .product-badge {
          display: flex;
          padding: 4px 16px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          position: absolute;
          left: 16px;
          top: 16px;
          border-radius: 100px;
          background: #0082FF;
          color: #FFF;
          text-align: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 150%;
        }

        .product-dots {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          position: absolute;
          left: 147px;
          top: 204px;
          width: 28px;
          height: 4px;
        }

        .dot {
          width: 4px;
          height: 4px;
          border-radius: 2px;
          background: rgba(0, 130, 255, 0.24);
        }

        .dot.active {
          background: #0082FF;
        }

        .wishlist-icon {
          position: absolute;
          left: 16px;
          top: 166px;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cart-icon {
          position: absolute;
          left: 266px;
          top: 166px;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .wishlist-icon:hover,
        .cart-icon:hover {
          transform: scale(1.05);
        }

        .product-info {
          display: flex;
          width: 322px;
          padding: 0 8px 8px 8px;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .product-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          align-self: stretch;
        }

        .product-title {
          flex: 1 0 0;
          color: #000;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 150%;
          margin: 0;
        }

        .delivery-time {
          display: flex;
          padding: 8px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 8px;
          background: rgba(0, 130, 255, 0.24);
          color: #0082FF;
          text-align: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 700;
          line-height: 150%;
        }

        .product-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          align-self: stretch;
        }

        .product-price {
          color: #000;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 150%;
        }

        .product-rating {
          display: flex;
          padding: 4px 16px;
          justify-content: center;
          align-items: center;
          gap: 4px;
        }

        .product-rating span {
          color: #0082FF;
          text-align: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 150%;
        }

        @media (max-width: 768px) {
          .product-image {
            width: 280px;
            height: 200px;
          }

          .product-info {
            width: 280px;
          }

          .product-title {
            font-size: 14px;
          }

          .delivery-time {
            font-size: 12px;
            padding: 6px;
          }
        }
      `}</style>
    </div>
  )
}
