'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import styles from './shipping-and-delivery.module.css'

export default function ShippingAndDeliveryPage() {
  return (
    <div className={styles.shippingPage}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Shipping & Delivery Policy</h1>
            {/* <p className={styles.lastUpdated}>Effective Date: 10/10/2025 | Last Updated: 10/10/2025</p> */}
          </div>

          <div className={styles.content}>
            <div className={styles.intro}>
              <p>
                This Shipping & Delivery Policy outlines how orders placed on the QLIQ platform ("we," "our,"
                "us") are processed, shipped, and delivered within the United Arab Emirates.
              </p>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Delivery Coverage</h2>
              <ul className={styles.bulletList}>
                <li>QLIQ delivers across serviceable areas within the UAE. Delivery availability may vary based on your address and courier network.</li>
                <li>We may expand or adjust service areas without prior notice.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Estimated Delivery Time</h2>
              <ul className={styles.bulletList}>
                <li>Estimated delivery timelines are displayed at checkout and in your confirmation email.</li>
                <li>Delivery time may vary due to stock availability, payment confirmation, distance, courier capacity, and unforeseen conditions such as weather, traffic, or public holidays.</li>
                <li>Orders placed after cutoff hours, weekends, or public holidays will be processed on the next working day.</li>
              </ul>
              <p>
                These timelines are indicative only; QLIQ does not guarantee specific delivery dates.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Order Tracking</h2>
              <ul className={styles.bulletList}>
                <li>Once your order is dispatched, you will receive a tracking link or may view status updates within your QLIQ account.</li>
                <li>You will be notified at key stages including dispatch, out-for-delivery, and completion.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Delivery Attempts and Failed Deliveries</h2>
              <p>Our logistics partners will attempt delivery to the address provided.</p>
              <p>An order may be marked as "Failed Delivery" if:</p>
              <ul className={styles.bulletList}>
                <li>No one is available to receive the order,</li>
                <li>The contact number provided is unreachable, or</li>
                <li>The delivery address is incorrect or inaccessible.</li>
              </ul>
              <p>
                In such cases, our team will attempt to contact you to reschedule.
              </p>
              <p>
                If delivery remains unsuccessful after reasonable attempts, the order may be cancelled without
                refund, as per our Cancellations, Returns & Refunds Policy.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Delivery Verification</h2>
              <p>
                Customers or their authorized representatives must verify and sign upon receipt. Please inspect
                items for any visible damage or discrepancies before accepting. Once received and signed,
                responsibility passes to you.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Contactless Delivery</h2>
              <p>
                You may request contactless delivery where available. In such cases, the order will be placed at
                your doorstep or designated area.
              </p>
              <p>
                QLIQ shall not be liable for theft, damage, or deterioration of goods after successful drop-off.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Delivery Fees</h2>
              <p>
                Delivery fees, if applicable, are mentioned below and also displayed at checkout prior to the
                payment.
              </p>
              
              <div className={styles.tableContainer}>
                <h3 className={styles.tableTitle}>Traditional E-Commerce COD - QLIQ Free Users</h3>
                <table className={styles.feeTable}>
                  <thead>
                    <tr>
                      <th>QLIQ E-Commerce</th>
                      <th colSpan="2">24 Hour Delivery</th>
                      <th colSpan="2">2-4 Day Delivery</th>
                    </tr>
                    <tr>
                      <th></th>
                      <th>Above AED 99</th>
                      <th>Below AED 99</th>
                      <th>Above AED 99</th>
                      <th>Below AED 99</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Fee (AED)</td>
                      <td>7.99</td>
                      <td>8.99</td>
                      <td>8.99</td>
                      <td>9.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={styles.tableContainer}>
                <h3 className={styles.tableTitle}>Traditional E-Commerce COD - QLIQ+ Members</h3>
                <table className={styles.feeTable}>
                  <thead>
                    <tr>
                      <th>QLIQ E-Commerce</th>
                      <th colSpan="2">24 Hour Delivery</th>
                      <th colSpan="2">2-4 Day Delivery</th>
                    </tr>
                    <tr>
                      <th></th>
                      <th>Above AED 99</th>
                      <th>Below AED 99</th>
                      <th>Above AED 99</th>
                      <th>Below AED 99</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Fee (AED)</td>
                      <td>Free</td>
                      <td>7.99</td>
                      <td>Free</td>
                      <td>8.99</td>
                    </tr>
                    <tr>
                      <td>Additional Fee (AED)</td>
                      <td>-</td>
                      <td>-</td>
                      <td>6.99</td>
                      <td>5.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Fees may vary depending on distance, weight, or promotional conditions.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>8. Delays beyond Control</h2>
              <p>
                QLIQ is not responsible for delays due to circumstances beyond its reasonable control, including
                weather, road closures, or courier disruptions.
              </p>
              <p>
                In such cases, our support team will communicate revised timelines.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>9. Customer Support</h2>
              <p>For any delivery concerns, please contact:</p>
              <div className={styles.contactInfo}>
                <p>
                  <a href="mailto:support@qliqlive.com" className={styles.emailLink}>
                    support@qliqlive.com
                  </a>
                </p>
                <p>QLIQ – Dubai, United Arab Emirates</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
