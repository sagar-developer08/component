import Image from 'next/image'
import styles from './orders.module.css'

export default function Orders() {
  return (
    <div className={styles.ordersList}>
      <div className={styles.orderItem}>
        <div className={styles.orderImageSection}>
          <Image
            src="/iphone.jpg"
            alt="Nike Airforce 01"
            width={120}
            height={80}
            className={styles.orderImage}
          />
        </div>
        <div className={styles.orderInfoSection}>
          <div className={styles.orderBrand}>Nike</div>
          <div className={styles.orderName}>Airforce 01</div>
          <div className={styles.orderPrice}>AED 1,200</div>
          <div className={styles.orderStatus}>Delivered</div>
        </div>
        <div className={styles.orderRightSection}>
          <div className={styles.orderDate}>20 Aug 2025</div>
        </div>
      </div>
      {/* ...repeat above block for each order as needed... */}
    </div>
  )
}
