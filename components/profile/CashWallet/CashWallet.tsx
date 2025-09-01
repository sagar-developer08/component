import styles from './cashWallet.module.css'

export default function CashWallet() {
  return (
    <div className={styles.walletHeader}>
      <div className={styles.balanceCard}>
        <div className={styles.balanceRow}>
          <svg width="40" height="40" fill="none"><circle cx="12" cy="12" r="10" fill="#0082FF" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <h3 className={styles.balanceTitle}>$ 1000</h3>
        </div>
        <div className={styles.AccountName}>Amma</div>
        <div className={styles.CardDetails}>
          <span className={styles.CardNumber}>4342 4234 5987</span>
          <span className={styles.DateExpiry}>11/26</span>
        </div>
      </div>
    </div>
  )
}
