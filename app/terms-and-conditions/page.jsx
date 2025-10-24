'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import styles from './terms-and-conditions.module.css'

export default function TermsAndConditionsPage() {
  return (
    <div className={styles.termsPage}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Terms and Conditions</h1>
            {/* <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p> */}
          </div>

          <div className={styles.content}>
            <div className={styles.intro}>
              <p>
                Welcome to QLIQ ("we," "our," or "us").
                These Terms and Conditions ("Terms") govern your access to and use of our website, mobile
                application, and related online services (collectively, the "Platform"), including the purchase of
                goods offered for sale through the Platform.
                By accessing, browsing, or purchasing on the Platform, you agree to be bound by these Terms.
                If you do not agree, please do not use the Platform.
              </p>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. General Overview</h2>
              <p>
                QLIQ operates as an online marketplace offering a wide range of consumer goods within the
                United Arab Emirates ("UAE"). These Terms apply to all users of the Platform, including
                customers, registered members, and visitors.
              </p>
              <p>
                QLIQ may modify these Terms at any time. Updated versions will be posted on this page, and
                continued use of the Platform constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Eligibility</h2>
              <ul className={styles.bulletList}>
                <li>You must be at least 18 years of age and capable of entering into legally binding agreements under UAE law.</li>
                <li>By using the Platform, you represent that you meet these requirements.</li>
                <li>QLIQ reserves the right to suspend or terminate access to any user found to be in violation of these Terms or any applicable law.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Account Registration</h2>
              <p>
                Certain features of the Platform may require registration. When creating an account, you must
                provide accurate, complete, and up-to-date information.
              </p>
              <p>You are responsible for:</p>
              <ul className={styles.bulletList}>
                <li>Maintaining the confidentiality of your login credentials;</li>
                <li>Restricting access to your account and device; and</li>
                <li>Accepting responsibility for all activities that occur under your account.</li>
              </ul>
              <p>
                QLIQ reserves the right to deactivate or suspend accounts involved in fraud, misuse, or policy
                violations.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Product Information</h2>
              <ul className={styles.bulletList}>
                <li>All product descriptions, specifications, and images are provided in good faith.</li>
                <li>QLIQ makes reasonable efforts to ensure accuracy but does not guarantee that details, such as color, packaging, or dimensions, will always match those displayed on the Platform.</li>
                <li>Product availability may change without notice. If an ordered item is unavailable, QLIQ will notify you and issue a refund as per our Cancellations, Returns & Refunds Policy.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Order Process</h2>
              <ol className={styles.numberedList}>
                <li>When you place an order, you make an offer to purchase the selected goods.</li>
                <li>QLIQ will acknowledge receipt of your order by email or in-app notification; however, such acknowledgment does not constitute acceptance.</li>
                <li>Acceptance occurs only when QLIQ confirms that the goods have been dispatched.</li>
                <li>QLIQ reserves the right to reject or cancel any order at its discretion, including cases of pricing or stock errors, suspected fraud, or payment failure.</li>
              </ol>
              <p>
                In such cases, any amounts paid will be refunded in accordance with our refund policy.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Pricing and Taxes</h2>
              <ul className={styles.bulletList}>
                <li>All prices are displayed in United Arab Emirates Dirhams (AED) and are inclusive of Value Added Tax (VAT) unless otherwise stated.</li>
                <li>Prices are subject to change without prior notice; however, confirmed orders will not be affected.</li>
                <li>QLIQ may offer discounts, promotions, or vouchers from time to time, subject to specific terms and validity periods.</li>
                <li>Any delivery, service, or handling fees will be displayed before checkout.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Payment Terms</h2>
              <ul className={styles.bulletList}>
                <li>QLIQ accepts multiple payment methods, including credit and debit cards, approved digital wallets, and any other options shown at checkout.</li>
                <li>All online payments are processed securely through licensed UAE payment gateways compliant with PCI DSS standards.</li>
                <li>QLIQ does not store card details.</li>
                <li>You confirm that the payment instrument used belongs to you or that you are authorized to use it.</li>
                <li>Orders are processed only upon successful payment authorization.</li>
              </ul>
              <p>
                Refunds, where applicable, will be issued in accordance with the Cancellations, Returns & Refunds Policy.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>8. Shipping and Delivery</h2>
              <ul className={styles.bulletList}>
                <li>QLIQ delivers within serviceable areas across the UAE.</li>
                <li>Delivery timelines provided at checkout are estimates only and may vary due to logistics conditions beyond our control.</li>
                <li>Ownership and risk transfer to the customer upon confirmed delivery.</li>
                <li>For detailed information, please refer to our Shipping & Delivery Policy.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>9. Returns, Cancellations, and Refunds</h2>
              <ul className={styles.bulletList}>
                <li>Orders may be cancelled prior to dispatch by contacting customer support or using in-app options.</li>
                <li>Once dispatched, cancellations will be treated as returns.</li>
                <li>Refunds will be processed to the original payment method and may take 7–14 business days (up to 30 for international banks).</li>
                <li>Eligibility and exclusions are detailed in our Cancellations, Returns & Refunds Policy.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>10. Warranty and After-Sales Support</h2>
              <ul className={styles.bulletList}>
                <li>Products may include a manufacturer or vendor warranty specifying repair or replacement coverage.</li>
                <li>Claims must be accompanied by valid proof of purchase and original packaging.</li>
                <li>Warranty remedies are provided in accordance with UAE Consumer Protection Law and detailed in our Warranty & Replacement Policy.</li>
                <li>Warranty does not cover accidental damage, misuse, or unauthorized repairs.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>11. Promotions and Vouchers</h2>
              <ul className={styles.bulletList}>
                <li>Promotional codes, gift cards, or vouchers may be used subject to their respective terms.</li>
                <li>Vouchers cannot be exchanged for cash or combined with other offers unless stated.</li>
                <li>QLIQ reserves the right to withdraw, amend, or suspend promotions without prior notice.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>12. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className={styles.bulletList}>
                <li>Use the Platform for fraudulent, unlawful, or misleading purposes;</li>
                <li>Post or transmit any harmful or inappropriate content;</li>
                <li>Interfere with Platform security or functionality; or</li>
                <li>Violate any applicable UAE laws or third-party rights.</li>
              </ul>
              <p>
                Violations may result in suspension or permanent termination of your account.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>13. Intellectual Property</h2>
              <p>
                All content on the Platform—including trademarks, logos, designs, graphics, and software—is
                the property of QLIQ or its licensors.
              </p>
              <p>
                You may not copy, reproduce, distribute, or exploit any content without prior written consent.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>14. Data Protection and Privacy</h2>
              <p>
                Your privacy is important to us. QLIQ collects and processes personal data in accordance with
                its Privacy Policy and the UAE Federal Decree-Law No. 45 of 2021 on the Protection of
                Personal Data (PDPL).
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>15. Limitation of Liability</h2>
              <p>To the fullest extent permitted under UAE law:</p>
              <ul className={styles.bulletList}>
                <li>QLIQ shall not be liable for indirect, incidental, or consequential damages arising from your use of the Platform;</li>
                <li>Our total liability shall not exceed the total value of the relevant order;</li>
                <li>Nothing in these Terms affects your statutory rights as a consumer.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>16. Force Majeure</h2>
              <p>
                QLIQ is not liable for any delay or failure in performance caused by events beyond its
                reasonable control, including natural disasters, government actions, strikes, or network failures.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>17. Governing Law and Jurisdiction</h2>
              <p>
                These Terms and all disputes arising hereunder are governed by the laws of the United Arab
                Emirates.
              </p>
              <p>
                The Courts of Dubai shall have exclusive jurisdiction.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>18. Contact Information</h2>
              <p>For any questions or assistance, please contact:</p>
              <div className={styles.contactInfo}>
                <p>
                  <a href="mailto:support@qliqlive.com" className={styles.emailLink}>
                    support@qliqlive.com
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
