import styles from './addCard.module.css'

export default function AddCard({ onCancel, onSave }) {
  const handleCancel = () => {
    onCancel()
  }

  const handleSave = () => {
    onSave()
  }

  return (
    <div className={styles.addCardContainer}>
      <h3 className={styles.addCardTitle}>ADD NEW CARD</h3>
      {/* <p className={styles.addCardSubtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
        et velit interdum, ac aliquet odio mattis.
      </p> */}
      <form className={styles.cardForm}>
        <div className={styles.cardFormRow}>
          <input
            className={styles.cardInput}
            type="text"
            placeholder="Card holder name"
            autoComplete="cc-name"
          />
          <input
            className={styles.cardInput}
            type="text"
            placeholder="Card number"
            autoComplete="cc-number"
            maxLength={19}
          />
        </div>
        <div className={styles.cardFormRow}>
          <input
            className={styles.cardInput}
            type="text"
            placeholder="MM/YY"
            autoComplete="cc-exp"
            maxLength={5}
          />
          <input
            className={styles.cardInput}
            type="text"
            placeholder="CVC"
            autoComplete="cc-csc"
            maxLength={4}
          />
        </div>
        <div className={styles.cardFormActions}>
          <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
