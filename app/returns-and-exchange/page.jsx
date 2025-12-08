'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import styles from './returns-and-exchange.module.css'

export default function ReturnsAndExchangePage() {
  return (
    <div className={styles.returnsPage}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Cancellations, Returns & Refunds Policy</h1>
            {/* <p className={styles.lastUpdated}>Effective Date: 10/10/2025 | Last Updated: 10/10/2025</p> */}
          </div>

          <div className={styles.content}>
            <div className={styles.intro}>
              <p>
                The Cancellations, Returns, & Refunds Policy explain how customers may cancel, return, or
                request refunds for purchases made on the QLIQ LIVE platform.
              </p>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Order Cancellation</h2>
              <ul className={styles.bulletList}>
                <li>Orders may be cancelled before dispatch by contacting Customer Support or using the in-app cancellation option (where available).</li>
                <li>Once dispatched, cancellations are not guaranteed and will be subject to the return process below.</li>
                <li>QLIQ LIVE reserves the right to cancel an order due to payment failure, incorrect information, suspected fraud, or unavailability.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Returns</h2>
              <p>You may request a return if:</p>
              <ul className={styles.bulletList}>
                <li>The product is damaged, defective, or not as described,</li>
                <li>The product is unopened, unused, and in its original packaging.</li>
              </ul>
              <p>
                Returns must be requested within 7 days of delivery, unless otherwise required by UAE law.
              </p>
              <p>
                Certain items (such as personal care, hygiene-sensitive, or digital goods) are not eligible for
                return except where faulty under UAE consumer protection laws.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Refunds</h2>
              <ul className={styles.bulletList}>
                <li>Approved refunds will be processed to the original payment method used at checkout.</li>
                <li>Refunds typically take 7–14 business days to reflect in your bank account, and up to 30 days for international banks.</li>
                <li>QLIQ LIVE is not responsible for delays caused by banks or payment processors.</li>
                <li>Refunds are issued only after inspection and confirmation that the returned item meets eligibility conditions.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Damaged or Incorrect Items</h2>
              <p>
                If you receive a wrong, damaged, or defective item, please contact Customer Support within 48
                hours of delivery and include photographs where applicable.
              </p>
              <p>
                Once verified, QLIQ LIVE will arrange replacement, repair, or refund as appropriate.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Non-Returnable Items</h2>
              <p>Returns and refunds are not applicable to:</p>
              <ul className={styles.bulletList}>
                <li>Items marked "Final Sale" or "Non-Returnable" at checkout,</li>
                <li>Personalized or customized items,</li>
                <li>Unsealed hygiene or health-related products,</li>
                <li>Digital downloads or electronic licenses.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Legal Framework</h2>
              <p>
                This policy complies with Federal Law No. 15 of 2020 on Consumer Protection and Cabinet
                Decision No. 66 of 2023.
              </p>
              <p>
                Refunds and cancellations outside these conditions remain at QLIQ LIVE's discretion.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Contact</h2>
              <p>For any questions or assistance, please contact:</p>
              <div className={styles.contactInfo}>
                <p>
                  <a href="mailto:support@qliqivelive.com" className={styles.emailLink}>
                    support@qliqivelive.com
                  </a>
                </p>
                <p>QLIQ LIVE – Dubai, United Arab Emirates</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
