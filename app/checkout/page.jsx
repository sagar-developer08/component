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
        <h1 className={styles.checkoutTitle}>CHECKOUT</h1>
        <p className={styles.checkoutSubtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
        </p>
        <div className={styles.checkoutContent}>
          {/* Left Side */}
          <div className={styles.checkoutLeft}>
            {/* Wallet Card */}
            <div className={styles.walletCard}>
              <div className={styles.walletIcon}>
                <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#0082FF" />
                  <path d="M12 16L16 20L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className={styles.walletTitle}>My Qoyns Wallet</div>
              </div>
              <div className={styles.walletInfo}>
                <div className={styles.walletBalance}>5000</div>
              </div>
              <div className={styles.walletExpiry}>Expires in 29 Days</div>
            </div>

            {/* Delivery Address */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Delivery Address</div>
              <div className={styles.addressCard}>
                <div className={styles.addressType}>
                  <span className={styles.addressLabel}>Home</span>
                  <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" fill="#0082FF" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div className={styles.addressDetails}>
                  <div className={styles.addressText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                  </div>
                  <div className={styles.addressContact}>970 500 500</div>
                  <div className={styles.addressContact}>example@gmail.com</div>
                </div>
              </div>
              <button className={styles.addAddressBtn}>+ Add New Address</button>
              {/* Address Form */}
              <div className={styles.addressForm}>
                <div className={styles.addressFormTabs}>
                  <button className={`${styles.addressTab} ${styles.active}`}><svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="10" fill="#0082FF" /></svg></button>
                  <button className={styles.addressTab}><svg width="20" height="20" fill="none"><rect x="2" y="2" width="16" height="16" rx="8" fill="#E5E5E5" /></svg></button>
                  <button className={styles.addressTab}><svg width="20" height="20" fill="none"><rect x="2" y="2" width="16" height="16" rx="8" fill="#E5E5E5" /></svg></button>
                  <input className={styles.addressLabelInput} placeholder="Label" />
                </div>
                <div className={styles.addressFormGrid}>
                  <select className={styles.addressInput}><option>Country</option></select>
                  <select className={styles.addressInput}><option>State</option></select>
                  <input className={styles.addressInput} placeholder="City" />
                  <input className={styles.addressInput} placeholder="Pincode" />
                  <input className={styles.addressInput} placeholder="Address" />
                </div>
                <div className={styles.addressFormActions}>
                  <button className={styles.cancelBtn}>Cancel</button>
                  <button className={styles.saveBtn}>Save</button>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Shipping Address</div>
              <div className={styles.shippingTabs}>
                <button className={styles.shippingTab1}>Same as Delivery Address</button>
                <button className={styles.shippingTab}>Use a Different Address</button>
              </div>
              {/* Shipping Address Form */}
              <div className={styles.addressForm}>
                <div className={styles.addressFormTabs}>
                  <button className={`${styles.addressTab} ${styles.active}`}><svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="10" fill="#0082FF" /></svg></button>
                  <button className={styles.addressTab}><svg width="20" height="20" fill="none"><rect x="2" y="2" width="16" height="16" rx="8" fill="#E5E5E5" /></svg></button>
                  <button className={styles.addressTab}><svg width="20" height="20" fill="none"><rect x="2" y="2" width="16" height="16" rx="8" fill="#E5E5E5" /></svg></button>
                  <input className={styles.addressLabelInput} placeholder="Label" />
                </div>
                <div className={styles.addressFormGrid}>
                  <select className={styles.addressInput}><option>Country</option></select>
                  <select className={styles.addressInput}><option>State</option></select>
                  <input className={styles.addressInput} placeholder="City" />
                  <input className={styles.addressInput} placeholder="Pincode" />
                  <input className={styles.addressInput} placeholder="Address" />
                </div>
                <div className={styles.addressFormActions}>
                  <button className={styles.cancelBtn}>Cancel</button>
                  <button className={styles.saveBtn}>Save</button>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Shipping Method</div>
              <div className={styles.shippingMethodCard}>
                <span>Standard</span>
                <span className={styles.shippingTime}>3 - 5 Days</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Payment Method</div>
              <div className={styles.paymentMethods}>
                <button className={styles.paymentOption}>Credit/Debit Card</button>
                <button className={styles.paymentOption}>
                  Pay With <span className={styles.paymentBadgeGreen}>CASH</span>
                </button>
                <button className={styles.paymentOption}>
                  Pay With <span className={styles.paymentBadgeOrange}>TAMARA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className={styles.checkoutRight}>
            <div className={styles.orderSummary}>
              <div className={styles.productItem}>
                <Image
                  src="/nike-shoe.png"
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
              {/* Qoyns Slider */}
              <div className={styles.qoynsSliderSection}>
                <div className={styles.qoynsSliderLabel}>Choose Qoyns to use</div>
                <div className={styles.qoynsSliderTrack}>
                  <input type="range" min="10" max="50" step="10" className={styles.qoynsSlider} />
                  <div className={styles.qoynsSliderTicks}>
                    <span>10%</span>
                    <span>20%</span>
                    <span>30%</span>
                    <span>40%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
              {/* Promo Code */}
              <div className={styles.promoCode}>
                <input className={styles.promoInput} value="" placeholder='OFF500' readOnly />
                <button className={styles.promoApplyBtn}>Apply</button>
              </div>
              {/* Totals */}
              <div className={styles.orderTotals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>AED 1,200</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className={styles.totalRow}>
                  <span>VAT</span>
                  <span>AED 50</span>
                </div>
                <div className={styles.totalRowDiscount}>
                  <span>Discount</span>
                  <span>- AED 500</span>
                </div>
                <div className={styles.totalRowFinal}>
                  <span>Order Total</span>
                  <span>AED 700</span>
                </div>
              </div>
              <button className={styles.placeOrderBtn}>Place Order</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}