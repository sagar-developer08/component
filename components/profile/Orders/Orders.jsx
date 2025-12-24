'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './orders.module.css'

export default function Orders({ orders }) {
  const router = useRouter()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#4CAF50'
      case 'pending':
        return '#FF9800'
      case 'rejected':
        return '#F44336'
        case 'accepted':
        return '#0082FF'
      case 'processing':
        return '#2196F3'
      case 'shipped':
        return '#9C27B0'
      case 'in-transit':
        return '#2196F3'
      default:
        return '#666'
    }
  }

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus.toLowerCase()) {
      case 'paid':
        return '#4CAF50'
      case 'pending':
        return '#FF9800'
      case 'failed':
        return '#F44336'
      case 'refunded':
        return '#9C27B0'
      default:
        return '#666'
    }
  }

  const getPaymentMethodLabel = (paymentMethod) => {
    switch (paymentMethod?.toLowerCase()) {
      case 'cash_wallet':
        return 'Cash Wallet'
      case 'stripe':
        return 'Card (Stripe)'
      case 'tabby':
        return 'Tabby'
      case 'cash_on_delivery':
        return 'Cash on Delivery'
      default:
        return paymentMethod || 'N/A'
    }
  }

  const handleOrderClick = (order, item) => {
    // Navigate to order history page with order and specific product
    const pid = item?.productId || item?.id || ''
    const url = pid ? `/orderhistory?orderId=${order._id}&productId=${encodeURIComponent(pid)}` : `/orderhistory?orderId=${order._id}`
    router.push(url)
  }

  // Loading and error states are now handled in the parent ProfilePage component

  if (!orders || orders.length === 0) {
    return (
      <div className={styles.ordersList}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          No orders found
        </div>
      </div>
    )
  }

  return (
    <div className={styles.ordersContainer}>
      {/* <div className={styles.ordersSummary} style={{ 
        padding: '16px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Your Orders</h3>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Total Amount: {orders.length > 0 ? orders[0].currency || 'USD' : 'USD'} {orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}
          </div>
        </div>
      </div> */}
      <div className={styles.ordersList}>
        {orders.map((order) => (
        (order.items || []).map((item, idx) => (
          <div 
            key={`${order._id}_${idx}`}
            className={styles.orderItem}
            onClick={() => handleOrderClick(order, item)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.orderImageSection}>
              {item ? (
                <Image
                  src={item.image || '/iphone.jpg'}
                  alt={item.name || 'Product'}
                  width={120}
                  height={80}
                  className={styles.orderImage}
                />
              ) : (
                <div className={styles.orderImage} style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  No Image
                </div>
              )}
            </div>
            <div className={styles.orderInfoSection}>
              <div className={styles.orderBrand}>Order #{order.orderNumber}</div>
              <div className={styles.orderName}>
                {item?.name || 'No items'}
              </div>
              {item?.quantity && (
                <div className={styles.orderQuantity} style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  Qty: {item.quantity}
                </div>
              )}
              {/* {item?.vendorName && item.vendorName !== 'Unknown Vendor' && (
                <div className={styles.orderVendor} style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  {item.vendorName}
                </div>
              )} */}
              <div className={styles.orderPrice}>
                {"AED"} {order.totalAmount?.toFixed(2)}
              </div>
              {/* Show shipping cost */}
              {(order.shippingCost > 0 || order.shippingMethodCost > 0) && (
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  Shipping: AED {(order.shippingCost || order.shippingMethodCost || 0).toFixed(2)}
                </div>
              )}
              {/* Show discount info if any */}
              {/* {(order.discount > 0 || order.qoynsDiscountAmount > 0 || order.couponDiscountAmount > 0 || order.cashWalletAmount > 0) && (
                <div style={{ fontSize: '11px', color: '#4CAF50', marginTop: '2px' }}>
                  {order.cashWalletAmount > 0 && `Wallet: -AED ${order.cashWalletAmount.toFixed(2)}`}
                  {order.cashWalletAmount > 0 && (order.qoynsDiscountAmount > 0 || order.couponDiscountAmount > 0) && ' | '}
                  {order.qoynsDiscountAmount > 0 && `Qoyns: -AED ${order.qoynsDiscountAmount.toFixed(2)}`}
                  {order.qoynsDiscountAmount > 0 && order.couponDiscountAmount > 0 && ' | '}
                  {order.couponDiscountAmount > 0 && `Coupon: -AED ${order.couponDiscountAmount.toFixed(2)}`}
                  {order.discount > 0 && !order.qoynsDiscountAmount && !order.couponDiscountAmount && !order.cashWalletAmount && `Discount: -AED ${order.discount.toFixed(2)}`}
                </div>
              )} */}
              {/* Show discount type */}
              {/* {order.discountType && (
                <div style={{ fontSize: '10px', color: '#9C27B0', marginTop: '2px' }}>
                  {order.discountType === 'cash_wallet' ? 'Cash Wallet Applied' : 
                   order.discountType === 'qoyn' ? 'Qoyn Discount' : 
                   order.discountType === 'coupon' ? 'Coupon Applied' : order.discountType}
                </div>
              )} */}
              <div 
                className={styles.orderStatus}
                style={{ color: getStatusColor(order.status) }}
              >
                {order.status}
              </div>
            </div>
            <div className={styles.orderRightSection}>
              <div className={styles.orderDate}>{formatDate(order.createdAt)}</div>
              <div style={{ 
                fontSize: '11px',
                color: '#666',
                marginTop: '4px'
              }}>
                {/* {getPaymentMethodLabel(order.paymentMethod)} */}
              </div>
              <div className={styles.paymentStatus} style={{ 
                color: getPaymentStatusColor(order.paymentStatus),
                fontSize: '12px',
                marginTop: '2px'
              }}>
                {order.paymentStatus}
              </div>
            </div>
          </div>
        ))
      ))}
      </div>
    </div>
  )
}
