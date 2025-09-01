import styles from './qoynsWallet.module.css'

export default function QoynsWallet() {
  return (
    <div className={styles.walletHeader}>
      <div className={styles.QoynsCard}>
        <div className={styles.balanceRow}>
          <svg width="40" height="40" fill="none"><circle cx="12" cy="12" r="10" fill="#0082FF" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <h3 className={styles.QoynsTitle}>My Qoyns Wallet</h3>
        </div>
        <div className={styles.QoynsBalance}>5000</div>
        <div className={styles.CardDetails}>
          <span className={styles.QoynsExiry}>Expiry in 29 Days</span>
        </div>
      </div>
    </div>
  )
}
