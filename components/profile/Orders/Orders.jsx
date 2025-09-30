'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile } from '../../../store/slices/profileSlice'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './orders.module.css'

export default function Orders() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { orders, loading, error } = useSelector(state => state.profile)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

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
      case 'cancelled':
        return '#F44336'
      case 'processing':
        return '#2196F3'
      default:
        return '#666'
    }
  }

  const handleOrderClick = (order, item) => {
    // Navigate to order history page with order and specific product
    const pid = item?.productId || item?.id || ''
    const url = pid ? `/orderhistory?orderId=${order._id}&productId=${encodeURIComponent(pid)}` : `/orderhistory?orderId=${order._id}`
    router.push(url)
  }

  if (loading) {
    return (
      <div className={styles.ordersList}>
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.ordersList}>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          Error loading orders: {error}
        </div>
      </div>
    )
  }

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
                  src="/iphone.jpg"
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
              <div className={styles.orderPrice}>
                {"AED"} {item?.price ?? order.totalAmount}
              </div>
              <div 
                className={styles.orderStatus}
                style={{ color: getStatusColor(order.status) }}
              >
                {order.status}
              </div>
            </div>
            <div className={styles.orderRightSection}>
              <div className={styles.orderDate}>{formatDate(order.createdAt)}</div>
              <div className={styles.paymentStatus} style={{ 
                color: order.paymentStatus === 'paid' ? '#4CAF50' : '#FF9800',
                fontSize: '12px',
                marginTop: '4px'
              }}>
                {order.paymentStatus}
              </div>
            </div>
          </div>
        ))
      ))}
    </div>
  )
}
