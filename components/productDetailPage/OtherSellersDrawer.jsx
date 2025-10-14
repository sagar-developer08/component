import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

export default function OtherSellersDrawer({ open, onClose, productId }) {
    const { requireAuth } = useAuth();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            if (productId) {
                fetchOtherSellers();
            }
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, productId]);

    const fetchOtherSellers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/products/${productId}/other-sellers`);
            const data = response.data.data;
            
            // Transform API data to match UI format
            const transformedSellers = [];

            // Add main product first
            if (data.mainProduct) {
                transformedSellers.push(transformProduct(data.mainProduct));
            }

            // Add other sellers
            if (data.otherSellers && data.otherSellers.length > 0) {
                data.otherSellers.forEach(seller => {
                    transformedSellers.push(transformProduct(seller));
                });
            }

            setSellers(transformedSellers);
        } catch (error) {
            console.error('Error fetching other sellers:', error);
            setSellers([]);
        } finally {
            setLoading(false);
        }
    };

    const transformProduct = (product) => {
        const finalPrice = product.discount_price || product.price;
        const discount = product.discount_price 
            ? Math.round(((product.price - product.discount_price) / product.price) * 100)
            : 0;

        const deliveryDate = getDeliveryDate();
        const orderTime = '2-3 days';
        
        // Calculate positive percentage based on rating
        const positive = product.average_rating 
            ? Math.round((product.average_rating / 5) * 100)
            : 0;

        const warranty = product.warranty_period 
            ? `${product.warranty_period} ${product.warranty_type || ''}`
            : 'No warranty';

        return {
            _id: product._id,
            price: finalPrice,
            discount: discount,
            orderTime: orderTime,
            rating: product.average_rating || 0,
            deliveryDate: deliveryDate,
            positive: positive,
            sellerName: product.store_id?.name || 'Unknown Store',
            warranty: warranty,
            stock: product.stock_quantity || 0,
            productData: product
        };
    };

    const getDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleAddToCart = (seller) => {
        requireAuth(() => {
            // Add to cart logic here
            console.log('Adding to cart from seller:', seller);
        });
    };

    if (!open) return null;

    return (
        <div className="other-sellers-drawer-overlay">
            <div className="other-sellers-drawer">
                <div className="drawer-header">
                    <span className="drawer-title">Other Sellers</span>
                    <button className="drawer-close" onClick={onClose}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <circle cx="14" cy="14" r="14" fill="#F5F5F5" />
                            <path d="M9 9L19 19M19 9L9 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="drawer-content">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading other sellers...</p>
                        </div>
                    ) : sellers.length === 0 ? (
                        <div className="empty-state">
                            <p>No other sellers available for this product</p>
                        </div>
                    ) : (
                        sellers.map((seller, idx) => (
                            <div className="seller-card" key={idx}>
                            <div className="seller-row">
                                <span className="seller-price">AED {seller.price}</span>
                                <span className="seller-discount">{seller.discount}% off</span>
                            </div>
                            <div className="seller-row">
                                <span className="seller-order">Order in {seller.orderTime}</span>
                                <span className="seller-star">
                                    <svg width="24px" height="24px" viewBox="0 0 20 20" fill="#0082FF">
                                        <path d="M10 15.0742L12.4208 16.5384C12.8635 16.8067 13.406 16.41 13.2894 15.9084L12.6477 13.155L14.7885 11.3C15.1794 10.9617 14.9694 10.32 14.456 10.2792L11.6385 10.04L10.536 7.43836C10.3377 6.96586 9.66104 6.96586 9.4627 7.43836L8.3602 10.0342L5.5427 10.2734C5.02937 10.3142 4.81937 10.9559 5.2102 11.2942L7.35104 13.1492L6.70937 15.9025C6.5927 16.4042 7.1352 16.8009 7.57854 16.5325L10 15.0742Z" />
                                    </svg>
                                    <span className="seller-rating">{seller.rating}</span>
                                </span>
                            </div>
                            <div className="seller-row seller-sub">
                                <span className="seller-delivery">Get it by {seller.deliveryDate}</span>
                                <span className="seller-positive">{seller.positive}% Positive</span>
                            </div>
                            <div className="seller-row seller-sub">
                                <span className="seller-label">Sold by</span>
                                <span className="seller-label">Warranty</span>
                            </div>
                            <div className="seller-row seller-sub">
                                <span className="seller-value">{seller.sellerName}</span>
                                <span className="seller-value">{seller.warranty}</span>
                            </div>
                            <button className="seller-add-cart" onClick={() => handleAddToCart(seller)}>Add To Cart</button>
                        </div>
                        ))
                    )}
                </div>
            </div>
            <style jsx>{`
        .other-sellers-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.08);
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
        }
        .other-sellers-drawer {
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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0082FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .loading-container p {
          color: #666;
          font-size: 16px;
          font-weight: 500;
        }
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }
        .empty-state p {
          color: #999;
          font-size: 16px;
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 32px 16px 32px;
          border-bottom: 1px solid #555;
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
        .drawer-content {
          padding: 24px 24px 24px 24px;
          overflow-y: auto;
          flex: 1;
        }
        .seller-card {
          margin-bottom: 32px;
        }
        .seller-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 24px;
          margin-bottom: 4px;
        }
        .seller-price {
          font-size: 20px;
          font-weight: 600;
          color: #000;
          line-height: 140%;
        }
        .seller-discount {
          font-size: 14px;
          font-weight: 600;
          color: #1FC70A;
          margin-left: 8px;
          line-height: 150%;
        }
        .seller-order {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          line-height: 150%;
        }
        .seller-star {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 24px;
          font-weight: 700;
          color: #0082FF;
        }
        .seller-rating {
          font-size: 16px;
          font-weight: 600;
          color: #0082FF;
        }
        .seller-sub {
          color: #000;
          font-weight: 600;
        }
        .seller-delivery {
          font-size: 14px;
          font-weight: 600;
          line-height: 150%;
          color: #000;
          margin-bottom: 8px;
        }
        .seller-positive {
          font-size: 14px;
          font-weight: 600;
          line-height: 150%;
          color: #000;
          margin-bottom: 8px;
        }
        .seller-label {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          line-height: 150%;
        }
        .seller-value {
          font-size: 14px;
          color: #000;
          font-weight: 600;
          line-height: 150%;
        }
        .seller-add-cart {
          width: 100%;
          margin-top: 18px;
          padding: 14px 0;
          background: #CBE6FF;
          color: #0082FF;
          font-size: 18px;
          font-weight: 600;
          border: none;
          border-radius: 24px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .seller-add-cart:hover {
          background: #b3dbff;
        }
        @media (max-width: 600px) {
          .other-sellers-drawer {
            width: 100vw;
            padding: 0;
          }
          .drawer-header {
            padding: 24px 16px 12px 16px;
          }
          .drawer-content {
            padding: 0 8px 16px 8px;
          }
        }
      `}</style>
        </div>
    );
}
