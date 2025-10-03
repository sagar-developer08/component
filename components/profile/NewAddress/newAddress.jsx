import styles from './newAddress.module.css'

export default function NewAddress({ onCancel, onSave }) {
  return (
    <div className={styles.newAddressContainer}>
      <h3 className={styles.title}>ADD NEW ADDRESS</h3>
      {/* <p className={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
        et velit interdum, ac aliquet odio mattis.
      </p> */}
      <form className={styles.form}>
        <div className={styles.labelRow}>
          <button type="button" className={`${styles.iconBtn} ${styles.active}`}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="16" fill="#0082FF"/>
              <path d="M10 18V14L16 10L22 14V18L16 22L10 18Z" fill="#fff"/>
            </svg>
          </button>
          <button type="button" className={styles.iconBtn}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="16" fill="#E5E5E5"/>
              <rect x="10" y="10" width="12" height="12" rx="3" fill="#222"/>
            </svg>
          </button>
          <button type="button" className={styles.iconBtn}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="16" fill="#E5E5E5"/>
              <circle cx="16" cy="16" r="6" fill="#222"/>
            </svg>
          </button>
          <input className={styles.labelInput} placeholder="Label" />
        </div>
        <div className={styles.gridRow}>
          <select className={styles.input}><option>Country</option></select>
          <select className={styles.input}><option>State</option></select>
        </div>
        <div className={styles.gridRow}>
          <input className={styles.input} placeholder="City" />
          <input className={styles.input} placeholder="Pincode" />
        </div>
        <div className={styles.fullRow}>
          <input className={styles.input} placeholder="Address" />
          <span className={styles.searchIcon}>
            <svg width="20" height="20" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#222" strokeWidth="2"/>
              <path d="M15 15L19 19" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button type="submit" className={styles.saveBtn} onClick={onSave}>Save</button>
        </div>
      </form>
    </div>
  )
}
