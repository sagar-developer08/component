import styles from './sendQoyn.module.css'

export default function SendQoyn({ onCancel, onSave }) {
  const handleCancel = () => {
    onCancel()
  }

  const handleSave = () => {
    onSave()
  }
  return (
    <form className={styles.sendQoynForm}>
      <div className={styles.row}>
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Send To</label>
          <select className={styles.inputSelect}>
            <option value="">Select recipient</option>
            <option value="ama">Ama Cruize</option>
            <option value="lorem">Lorem Lipsum</option>
          </select>
          <span className={styles.arrow}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 7L9 12L14 7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Amount</label>
          <input className={styles.inputText} type="number" placeholder="Amount" />
        </div>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
        <button type="submit" className={styles.sendBtn} onClick={handleSave}>Send</button>
      </div>
    </form>
  )
}
