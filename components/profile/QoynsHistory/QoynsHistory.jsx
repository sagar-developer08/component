import styles from './qoynsHistory.module.css'

const historyData = [
  { name: 'Ama Cruize', date: '20 Aug 2025, 14:35 pm', amount: 500 },
  { name: 'Lorem Lipsum', date: '20 Aug 2025, 14:35 pm', amount: 500 },
  { name: 'Lorem Lipsum', date: '20 Aug 2025, 14:35 pm', amount: 500 }
]

export default function QoynsHistory() {
  return (
    <div className={styles.historyList}>
      {historyData.map((item, idx) => (
        <div className={styles.historyItem} key={idx}>
          <div className={styles.historyLeft}>
            <div className={styles.avatar}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#E5F0FF"/>
                <path d="M20 22c-3.333 0-6 1.333-6 4v2h12v-2c0-2.667-2.667-4-6-4zm0-2a3 3 0 100-6 3 3 0 000 6z" fill="#0082FF"/>
              </svg>
            </div>
            <div>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.date}>{item.date}</div>
            </div>
          </div>
          <div className={styles.amount}>{item.amount}</div>
        </div>
      ))}
    </div>
  )
}
