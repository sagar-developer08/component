import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice'
import { addToCart, removeFromCart, updateCartItem, fetchCart } from '@/store/slices/cartSlice'
import { getUserFromCookies } from '@/utils/userUtils'
import { useToast } from '@/contexts/ToastContext'
import { decryptText } from '@/utils/crypto'
import { generateProductUrl } from '@/utils/productUtils'

export default function ProductCard({
  id,
  slug,
  title,
  price,
  rating,
  deliveryTime,
  image,
  badge = "-$500 on your first order",
  showIcons = true
}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { requireAuth } = useAuth()
  const [imageError, setImageError] = useState(false)
  const [isCartHover, setIsCartHover] = useState(false)
  const { show } = useToast()
  const { items: wishlistItems } = useSelector(state => state.wishlist)
  const { items: cartItems } = useSelector(state => state.cart)
  
  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item.productId === id)
  
  // Check cart state for this product
  const cartItem = cartItems.find(item => item.productId === id)
  const cartQuantity = cartItem?.quantity || 0
  const isInCart = cartQuantity > 0

  // Fallback image URL
  const fallbackImage = 'https://api.builder.io/api/v1/image/assets/TEMP/0ef2d416817956be0fe96760f14cbb67e415a446?width=644'
  const imageSrc = imageError ? fallbackImage : image

  const handleCardClick = () => {
    const generatedSlug = (slug
      || (typeof title === 'string' ? title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : '')
      || id)
    const url = id ? generateProductUrl(id, generatedSlug) : `/product/${generatedSlug}`
    router.push(url)
  }

  const handleWishlistClick = async (e) => {
    e.stopPropagation()
    requireAuth(() => {
      ; (async () => {
        let userId = ''
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';').map(c => c.trim())
          const userCookie = cookies.find(c => c.startsWith('userId='))
          if (userCookie) {
            try {
              const enc = decodeURIComponent(userCookie.split('=')[1] || '')
              userId = await decryptText(enc)
            } catch { }
          }
        }
        if (!userId) {
          show('Please login to manage wishlist', 'error')
          return
        }

        if (isInWishlist) {
          // Remove from wishlist
          const result = await dispatch(removeFromWishlist({
            userId,
            productId: id
          }))
          if (removeFromWishlist.fulfilled.match(result)) {
            show('Removed from wishlist')
          } else if (removeFromWishlist.rejected.match(result)) {
            show('Failed to remove from wishlist', 'error')
          }
        } else {
          // Add to wishlist
          const result = await dispatch(addToWishlist({
            userId,
            productId: id,
            name: title,
            price: typeof price === 'string' ? Number(String(price).replace(/[^0-9.]/g, '')) : price,
            image: image
          }))
          if (addToWishlist.fulfilled.match(result)) {
            if (result.payload?.isDuplicate) {
              show('Item already in wishlist')
            } else {
              show('Added to wishlist')
            }
          } else if (addToWishlist.rejected.match(result)) {
            show('Failed to add to wishlist', 'error')
          }
        }
      })()
    })
  }

  const handleCartClick = async (e) => {
    e.stopPropagation()
    requireAuth(() => {
      ; (async () => {
        const userId = await getUserFromCookies()
        
        const cartItem = {
          userId,
          productId: id,
          name: title,
          price: typeof price === 'string' ? Number(String(price).replace(/[^0-9.]/g, '')) : price,
          quantity: 1,
          image: image
        }
        
        const result = await dispatch(addToCart(cartItem))
        if (addToCart.fulfilled.match(result)) {
          show('Added to cart')
          
          // After successful add, fetch the updated cart to refresh counts
          dispatch(fetchCart(userId))
        } else if (addToCart.rejected.match(result)) {
          show('Failed to add to cart', 'error')
        }
      })()
    })
  }
  
  const handleRemoveFromCart = async (e) => {
    e.stopPropagation()
    requireAuth(() => {
      ; (async () => {
        const userId = await getUserFromCookies()
        const result = await dispatch(removeFromCart({ userId, productId: id }))
        if (removeFromCart.fulfilled.match(result)) {
          show('Removed from cart')
          // Refresh cart data to update counts
          dispatch(fetchCart(userId))
        } else if (removeFromCart.rejected.match(result)) {
          show('Failed to remove from cart', 'error')
        }
      })()
    })
  }
  
  const handleIncreaseQuantity = async (e) => {
    e.stopPropagation()
    requireAuth(() => {
      ; (async () => {
        const userId = await getUserFromCookies()
        const result = await dispatch(updateCartItem({
          userId,
          productId: id,
          quantity: cartQuantity + 1
        }))
        if (updateCartItem.fulfilled.match(result)) {
          show('Quantity updated')
          // Refresh cart data to update counts
          dispatch(fetchCart(userId))
        } else if (updateCartItem.rejected.match(result)) {
          show('Failed to update quantity', 'error')
        }
      })()
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
            <button className="wishlist-icon" aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"} onClick={handleWishlistClick}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill={isInWishlist ? "#FF0000" : "#0082FF"} />
                <path d="M20.09 25.5586L20 25.6458L19.901 25.5586C15.626 21.8005 12.8 19.3155 12.8 16.7956C12.8 15.0518 14.15 13.7439 15.95 13.7439C17.336 13.7439 18.686 14.6158 19.163 15.8016H20.837C21.314 14.6158 22.664 13.7439 24.05 13.7439C25.85 13.7439 27.2 15.0518 27.2 16.7956C27.2 19.3155 24.374 21.8005 20.09 25.5586ZM24.05 12C22.484 12 20.981 12.7063 20 13.8136C19.019 12.7063 17.516 12 15.95 12C13.178 12 11 14.1014 11 16.7956C11 20.0828 14.06 22.7771 18.695 26.849L20 28L21.305 26.849C25.94 22.7771 29 20.0828 29 16.7956C29 14.1014 26.822 12 24.05 12Z" fill="white" />
              </svg>
            </button>

            <div className="cart-control-container">
              <div
                className="cart-control"
                onMouseEnter={() => setIsCartHover(true)}
                onMouseLeave={() => setIsCartHover(false)}
              >
                {isInCart && isCartHover ? (
                  <div className="cart-quantity-control">
                    <button className="delete-icon" aria-label="Remove from cart" onClick={handleRemoveFromCart}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 5L15 15M15 5L5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div className="quantity-display">
                      <span>{cartQuantity}</span>
                    </div>
                    <button className="plus-icon" aria-label="Increase quantity" onClick={handleIncreaseQuantity}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button className="cart-icon" aria-label="Add to cart" onClick={handleCartClick}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect width="40" height="40" rx="20" fill="#0082FF" />
                      <path d="M16.1818 15.1538C16.1818 15.1538 16.1818 11 20 11C23.8182 11 23.8182 15.1538 23.8182 15.1538M13 15.1538V29H27V15.1538H13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {isInCart && (
                      <span className="cart-badge">{cartQuantity}</span>
                    )}
                  </button>
                )}
              </div>
            </div>
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
              <path d="M6.99937 10.0742L9.4202 11.5384C9.86354 11.8067 10.406 11.41 10.2894 10.9084L9.64771 8.15503L11.7885 6.30003C12.1794 5.96169 11.9694 5.32003 11.456 5.27919L8.63854 5.04003L7.53604 2.43836C7.3377 1.96586 6.66104 1.96586 6.4627 2.43836L5.3602 5.03419L2.5427 5.27336C2.02937 5.31419 1.81937 5.95586 2.2102 6.29419L4.35104 8.14919L3.70937 10.9025C3.5927 11.4042 4.1352 11.8009 4.57854 11.5325L6.99937 10.0742Z" fill="#0082FF" />
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
          bottom: 16px;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cart-icon {
          position: relative;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .wishlist-icon:hover,
        .cart-icon:hover {
          transform: scale(1.05);
        }
        
        .cart-control-container {
          position: absolute;
          right: 16px;
          bottom: 16px;
          z-index: 5;
        }
        
        .cart-control {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .cart-quantity-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0082FF;
          border-radius: 20px;
          padding: 4px;
          width: 120px;
          height: 40px;
        }
        
        .delete-icon, .plus-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .delete-icon:hover, .plus-icon:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .quantity-display {
          color: white;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
        }
        
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: white;
          color: #0082FF;
          border: 2px solid #0082FF;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: 700;
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

