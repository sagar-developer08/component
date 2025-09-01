import styles from './addresses.module.css'

export default function Addresses() {
  return (
    <div className={styles.walletHeader}>
      <div className={styles.QoynsCard}>
        <div className={styles.balanceRow}>
          <h3 className={styles.AddressTitle}>Home</h3>
          <svg width="40" height="40" fill="none"><circle cx="12" cy="12" r="10" fill="#0082FF" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div className={styles.AddressContent}>Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</div>
        <div className={styles.CardDetails}>
          <span className={styles.addressNumber}>970 500 500</span>
        </div>
        <div className={styles.CardDetails}>
          <span className={styles.addressEmail}>example@gmail.com</span>
        </div>
      </div>
    </div>
  )
}
