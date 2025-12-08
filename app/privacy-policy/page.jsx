'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import styles from './privacy-policy.module.css'

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.privacyPage}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Privacy Policy</h1>
            {/* <p className={styles.lastUpdated}>Last updated: 10/10/2025</p> */}
          </div>

          <div className={styles.content}>
            <div className={styles.intro}>
              <p>
                This Payment & Pricing Policy outlines how payments are processed and how prices, fees, and
                taxes are displayed on the QLIQ LIVE platform.
              </p>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Currency and Pricing</h2>
              <ul className={styles.bulletList}>
                <li>All prices are listed in United Arab Emirates Dirhams (AED) and inclusive of VAT (5%) unless otherwise stated.</li>
                <li>Prices are subject to change without notice but will not affect confirmed orders.</li>
                <li>Promotions, discounts, and coupons may be offered periodically and are subject to specific terms and expiry dates.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Accepted Payment Methods</h2>
              <p>QLIQ LIVE accepts the following:</p>
              <ul className={styles.bulletList}>
                <li>Credit and debit cards,</li>
                <li>Approved digital wallets,</li>
                <li>Any additional method displayed at checkout.</li>
              </ul>
              <p>
                All online transactions are securely processed through licensed UAE payment gateways.
                QLIQ LIVE does not store card details and complies with the Payment Card Industry Data
                Security Standards (PCI DSS).
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Payment Confirmation</h2>
              <ul className={styles.bulletList}>
                <li>Orders are confirmed only after successful payment authorization.</li>
                <li>If payment fails or is declined, your order will not be processed.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Refund Processing</h2>
              <ul className={styles.bulletList}>
                <li>Approved refunds (as per our Refund Policy) are credited to the original payment method.</li>
                <li>Refunds take approximately 7–14 working days to process, subject to your bank's procedures.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Pricing Errors</h2>
              <p>
                In the event of an inadvertent pricing or typographical error, QLIQ LIVE reserves the right to
                cancel the order and issue a full refund.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Additional Fees</h2>
              <ul className={styles.bulletList}>
                <li>Delivery or service fees, where applicable, will be displayed separately before checkout.</li>
                <li>Customers agree to the final total amount shown prior to order</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
