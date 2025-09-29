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

  const handleOrderClick = (order) => {
    // Navigate to order history page with order data
    router.push(`/orderhistory?orderId=${order._id}`)
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
        <div 
          key={order._id} 
          className={styles.orderItem}
          onClick={() => handleOrderClick(order)}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.orderImageSection}>
            {order.items && order.items.length > 0 ? (
              <Image
                src="/iphone.jpg" // You might want to use actual product images
                alt={order.items[0].name}
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
              {order.items && order.items.length > 0 
                ? `${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}`
                : 'No items'
              }
            </div>
            <div className={styles.orderPrice}>
              {order.currency} {order.totalAmount}
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
      ))}
    </div>
  )
}
