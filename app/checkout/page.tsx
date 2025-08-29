'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import styles from './checkout.module.css'

export default function CheckoutPage() {
  return (
    <div className={styles.checkoutPage}>
      <Navigation />
      
      <div className={styles.checkoutContainer}>
        <div className={styles.backButton}>
          <button className={styles.backBtn}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        </div>

        <h1 className={styles.checkoutTitle}>CHECKOUT</h1>
        <p className={styles.checkoutSubtitle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p>

        <div className={styles.checkoutContent}>
          <div className={styles.checkoutLeft}>
            {/* Qoyns Wallet Section */}
            <div className={styles.walletSection}>
              <div className={styles.walletCard}>
                <div className={styles.walletIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#0082FF"/>
                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.walletInfo}>
                  <div className={styles.walletTitle}>My Qoyns Wallet</div>
                  <div className={styles.walletBalance}>5000</div>
                  <div className={styles.walletExpiry}>Expires in 25 Days</div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Where?</h3>
              <div className={styles.locationSelector}>
                <div className={styles.locationItem}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2Z" fill="#000"/>
                    <path d="M10 12C6.68629 12 4 14.6863 4 18H16C16 14.6863 13.3137 12 10 12Z" fill="#000"/>
                  </svg>
                  <span>Dubai</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.arrow}>
                    <path d="M7.5 5L12.5 10L7.5 15" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.addNote}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Add note for the courier</span>
                </div>
              </div>
            </div>

            {/* Delivery Time Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>When?</h3>
              <div className={styles.deliveryTime}>
                <div className={`${styles.timeOption} ${styles.selected}`}>
                  <span>Standard</span>
                  <span className={styles.timeRange}>30 - 40 Min</span>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Payment Method</h3>
              <div className={styles.paymentMethods}>
                <button className={`${styles.paymentOption} ${styles.selected}`}>
                  Pay With Qoyns
                </button>
                <button className={styles.paymentOption}>
                  Credit/Debit Card
                </button>
                <button className={styles.paymentOption}>
                  <span>Pay With</span>
                  <span className={`${styles.paymentBadge} ${styles.green}`}>CASH</span>
                </button>
                <button className={styles.paymentOption}>
                  <span>Pay With</span>
                  <span className={`${styles.paymentBadge} ${styles.orange}`}>TAMARA</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.checkoutRight}>
            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <div className={styles.productItem}>
                <Image
                  src="/iphone.jpg"
                  alt="Nike Airforce 01"
                  width={60}
                  height={60}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                  <div className={styles.productBrand}>Nike</div>
                  <div className={styles.productName}>Airforce 01</div>
                  <div className={styles.productQuantity}>Qty: 1</div>
                </div>
                <div className={styles.productPrice}>AED 1,200</div>
              </div>

              <div className={styles.promoCode}>
                <div className={styles.promoInput}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 4H16V16H8L4 10L8 4Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="1" fill="#000"/>
                  </svg>
                  <span>OFF500</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.dropdown}>
                    <path d="M6 8L10 12L14 8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className={styles.orderTotals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>AED 1,200</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className={`${styles.totalRow} ${styles.discount}`}>
                  <span>Discount</span>
                  <span>- AED 500</span>
                </div>
                <div className={`${styles.totalRow} ${styles.final}`}>
                  <span>Order Total</span>
                  <span>AED 700</span>
                </div>
              </div>

              <button className={styles.placeOrderBtn}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}