import { useState, useEffect } from 'react';
import Image from 'next/image';
import OtherSellersDrawer from './OtherSellersDrawer';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, fetchCart } from '../../store/slices/cartSlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import { getUserFromCookies } from '../../utils/userUtils';
import { useToast } from '../../contexts/ToastContext';

export default function ProductDetails({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.selectedColor || product.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product.selectedSize || product.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const { requireAuth } = useAuth();
  const dispatch = useDispatch();
  const { show } = useToast();
  
  // Check if product is in cart or wishlist
  const { items: cartItems } = useSelector(state => state.cart);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  const isInCart = cartItems.some(item => item.productId === product.id);
  const isInWishlist = wishlistItems.some(item => item.productId === product.id);

  // Sync local state with props when they change
  useEffect(() => {
    if (product.selectedColor) {
      setSelectedColor(product.selectedColor);
    }
    if (product.selectedSize) {
      setSelectedSize(product.selectedSize);
    }
    
    // Update button states based on cart and wishlist
    setIsAddedToCart(isInCart);
    setIsAddedToWishlist(isInWishlist);
  }, [product.selectedColor, product.selectedSize, isInCart, isInWishlist]);

  // Sync local state with props when they change
  useEffect(() => {
    if (product.selectedColor) {
      setSelectedColor(product.selectedColor);
    }
    if (product.selectedSize) {
      setSelectedSize(product.selectedSize);
    }
  }, [product.selectedColor, product.selectedSize]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    // If already in cart, don't add again
    if (isAddedToCart || isInCart) {
      show('Item already in cart')
      return
    }
    
    requireAuth(() => {
      ; (async () => {
        const userId = await getUserFromCookies()

        const cartItem = {
          userId,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images[0],
          selectedColor,
          selectedSize
        }

        const result = await dispatch(addToCart(cartItem))
        if (addToCart.fulfilled.match(result)) {
          show('Added to cart')
          setIsAddedToCart(true)
          
          // Refresh cart data
          dispatch(fetchCart(userId))
        } else if (addToCart.rejected.match(result)) {
          show('Failed to add to cart', 'error')
        }
      })()
    });
  };

  const handleAddToFavourite = () => {
    // If already in wishlist, don't add again
    if (isAddedToWishlist || isInWishlist) {
      show('Item already in wishlist')
      return
    }
    
    requireAuth(() => {
      ; (async () => {
        const userId = await getUserFromCookies()
        const wishlistItem = {
          userId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]
        }

        const result = await dispatch(addToWishlist(wishlistItem))
        if (addToWishlist.fulfilled.match(result)) {
          const isDuplicate = result.payload?.isDuplicate
          show(isDuplicate ? 'Already in wishlist' : 'Added to wishlist')
          setIsAddedToWishlist(true)
        } else if (addToWishlist.rejected.match(result)) {
          show('Failed to add to wishlist', 'error')
        }
      })()
    });
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
        {/* Product Images Section */}
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
              width={400}
              height={400}
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

        {/* Product Information Section */}
        <div className="product-info">
          {/* Brand and Bought Count */}
          <div className="brand-row">
            <div className="brand-name">{product.brand}</div>
            <div className="bought-count">{product.boughtCount}</div>
          </div>

          {/* Product Name and Availability */}
          <div className="product-name-row">
            <h1 className="product-name">{product.name}</h1>
            <div className="availability-info">
              <div className="delivery-time">{product.deliveryTime}</div>
              <div className="stock-status">{product.stock}</div>
            </div>
          </div>

          {/* Rating */}
          <div className="rating-section">
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 15.0742L12.4208 16.5384C12.8635 16.8067 13.406 16.41 13.2894 15.9084L12.6477 13.155L14.7885 11.3C15.1794 10.9617 14.9694 10.32 14.456 10.2792L11.6385 10.04L10.536 7.43836C10.3377 6.96586 9.66104 6.96586 9.4627 7.43836L8.3602 10.0342L5.5427 10.2734C5.02937 10.3142 4.81937 10.9559 5.2102 11.2942L7.35104 13.1492L6.70937 15.9025C6.5927 16.4042 7.1352 16.8009 7.57854 16.5325L10 15.0742Z" fill="#0082FF" />
                </svg>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="pricing-section">
            <div className="price-row">
              <span className="original-price">AED {product.originalPrice.toLocaleString()}</span>
              <span className="current-price">AED {product.price.toLocaleString()}</span>
              <span className="discount">{product.discount}% Off</span>
            </div>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 1 && (
            <div className="selection-section">
              <div className="selection-label">Color:</div>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedColor(color);
                      if (product.onColorChange) {
                        product.onColorChange(color);
                      }
                    }}
                  >
                    {color}
                  </button>
                ))}
                <div className="fox-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#FF6B35"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 1 && (
            <div className="selection-section">
              <div className="selection-label">Size:</div>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedSize(size);
                      if (product.onSizeChange) {
                        product.onSizeChange(size);
                      }
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="share-section">
            <div className="share-label">Share:</div>
            <div className="share-icons">
              <div className="share-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="black"/>
                </svg>
              </div>
              <div className="share-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" fill="#1877F2"/>
                </svg>
              </div>
              <div className="share-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="black"/>
                </svg>
              </div>
              <div className="share-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.16 11.88c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893A11.821 11.821 0 0020.885 3.488" fill="#25D366"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Other Sellers */}
          <div className="other-sellers" onClick={() => setDrawerOpen(true)}>
            <span>Other Sellers</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z" fill="black"/>
            </svg>
          </div>

          {/* Payment Policy Card */}
          <div className="payment-policy-card">
            <div className="policy-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#0082FF"/>
              </svg>
            </div>
            <div className="policy-content">
              <div className="policy-title">Pay in 3 interest-free payments</div>
              <div className="policy-link">Learn More</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-item">
              <div className="info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="black"/>
                </svg>
              </div>
              <span>Return Policy</span>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="black"/>
                </svg>
              </div>
              <span>1 Year Warranty</span>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="black"/>
                </svg>
              </div>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar for Mobile */}
      <div className="bottom-action-bar">
        <div className="quantity-selector">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        
        <div className="heart-icon" onClick={handleAddToFavourite}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={isAddedToWishlist || isInWishlist ? "#FF6B6B" : "#666"}/>
          </svg>
        </div>
        
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isAddedToCart || isInCart}
        >
          {(isAddedToCart || isInCart) ? 'Added To Cart' : 'Add To Cart'}
        </button>
      </div>

      <OtherSellersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} sellers={sellers} />

      <style jsx>{`
        .product-details {
          background: white;
          min-height: 100vh;
        }

        .product-main {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Product Images Section */
        .product-images {
          position: relative;
          background: white;
        }

        .main-image-container {
          position: relative;
          width: 100%;
          height: 400px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
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
          background: rgba(0, 0, 0, 0.1);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
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
          justify-content: center;
          gap: 8px;
          padding: 16px 0;
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

        /* Product Information Section */
        .product-info {
          padding: 20px 16px;
          background: white;
        }

        .brand-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
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

        .product-name-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .product-name {
          font-size: 24px;
          font-weight: 700;
          color: #000;
          margin: 0;
          line-height: 1.2;
          flex: 1;
        }

        .availability-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .delivery-time {
          color: #0082FF;
          font-size: 14px;
          font-weight: 600;
        }

        .stock-status {
          color: #000;
          font-size: 14px;
          font-weight: 600;
        }

        .rating-section {
          margin-bottom: 16px;
        }

        .rating {
          display: flex;
          gap: 2px;
        }

        .pricing-section {
          margin-bottom: 20px;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .original-price {
          color: #999;
          text-decoration: line-through;
          font-size: 16px;
          font-weight: 500;
        }

        .current-price {
          color: #000;
          font-size: 28px;
          font-weight: 700;
        }

        .discount {
          color: #1FC70A;
          font-size: 14px;
          font-weight: 600;
        }

        /* Selection Sections */
        .selection-section {
          margin-bottom: 20px;
        }

        .selection-label {
          font-weight: 600;
          color: #000;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .color-options, .size-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .color-btn, .size-btn {
          padding: 8px 16px;
          border: 2px solid #0082FF;
          border-radius: 20px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
        }

        .color-btn.selected, .size-btn.selected {
          background: #0082FF;
          color: white;
        }

        .fox-icon {
          margin-left: 8px;
        }

        /* Share Section */
        .share-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .share-label {
          font-weight: 600;
          color: #000;
          font-size: 16px;
        }

        .share-icons {
          display: flex;
          gap: 8px;
        }

        .share-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Other Sellers */
        .other-sellers {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border: 2px solid #0082FF;
          border-radius: 25px;
          cursor: pointer;
          margin-bottom: 20px;
          background: white;
        }

        .other-sellers span {
          font-weight: 600;
          color: #000;
          font-size: 16px;
        }

        /* Payment Policy Card */
        .payment-policy-card {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #0082FF;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          gap: 12px;
        }

        .policy-icon {
          flex-shrink: 0;
        }

        .policy-content {
          flex: 1;
        }

        .policy-title {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          margin-bottom: 4px;
        }

        .policy-link {
          font-size: 14px;
          font-weight: 600;
          color: #0082FF;
        }

        /* Additional Info */
        .additional-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #000;
          font-weight: 600;
          font-size: 16px;
        }

        .info-icon {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Bottom Action Bar */
        .bottom-action-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 100;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f0f8ff;
          border-radius: 20px;
          padding: 8px 12px;
        }

        .quantity-selector button {
          width: 24px;
          height: 24px;
          border: none;
          background: #0082FF;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quantity-selector span {
          min-width: 20px;
          text-align: center;
          font-weight: 600;
          font-size: 16px;
        }

        .heart-icon {
          width: 40px;
          height: 40px;
          background: #f0f8ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .add-to-cart-btn {
          flex: 1;
          background: #0082FF;
          color: white;
          border: none;
          border-radius: 25px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .add-to-cart-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        /* Desktop Styles */
        @media (min-width: 769px) {

          .product-main {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
          }

          .product-images {
            background: transparent;
          }

          .main-image-container {
            height: 500px;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.1);
          }

          .product-info {
            padding: 0;
            background: transparent;
          }

          .product-name {
            font-size: 32px;
          }

          .current-price {
            font-size: 32px;
          }

          .bottom-action-bar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}